package yte.intern.spring.application.usecases.managestudents.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import yte.intern.spring.application.usecases.common.MessageResponse;
import yte.intern.spring.application.usecases.common.enums.MessageType;
import yte.intern.spring.application.usecases.managestudents.dto.AdminMessageDTO;
import yte.intern.spring.application.usecases.managestudents.dto.UserDTO;
import yte.intern.spring.application.usecases.managestudents.entity.Authority;
import yte.intern.spring.application.usecases.managestudents.entity.Event;
import yte.intern.spring.application.usecases.managestudents.entity.EventUser;
import yte.intern.spring.application.usecases.managestudents.mapper.UserMapper;
import yte.intern.spring.application.usecases.managestudents.repository.AuthorityRepository;
import yte.intern.spring.application.usecases.managestudents.repository.EventRepository;
import yte.intern.spring.application.usecases.managestudents.repository.UserRepository;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final EventRepository eventRepository;
    private final AdminService adminService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserMapper userMapper;
    //private final PasswordEncoder passwordEncoder;

    public String DecodeWithBase64(String decodedString) {
        //sondaki eşitiri silmek için(formatı desteklemiyor)
        System.out.println(decodedString);
        String str = decodedString.substring(0, decodedString.length() - 1);
        return new String(Base64.getDecoder().decode(str));
    }

    public MessageResponse tokenAuth(String tokenToDecode) {

        //System.out.println("TOKEN : " + tokenToDecode);
        String usernameAndPassword = this.DecodeWithBase64(tokenToDecode);
        String tcKimlikNo = usernameAndPassword.split(":")[0];
        String password = usernameAndPassword.split(":")[1];

        EventUser user = userRepository.findByTcKimlikNo(tcKimlikNo);
        //User ın authoritileri
        List<String> authorityList= new ArrayList<>();
        //user.getAuthorities().forEach(i-> authorityList.add(i.getAuthority()));
        System.out.println(authorityList);
        //System.out.println("Name: " + user.getName() + "  TC Kimlik No: " + tcKimlikNo + "   Password: " + password);
        if (user != null) {
            if (user.getPassword().equals(password)) {
                return new MessageResponse("You logged in successfully!", MessageType.SUCCESS);
            } else {
                return new MessageResponse("Entered wrong password!", MessageType.ERROR);
            }
        } else {
            return new MessageResponse("This Tc kimlik no is not registered yet!", MessageType.ERROR);
        }


    }

    public MessageResponse addUser(EventUser eventUser) {
        Set<Authority> authorities = new HashSet<Authority>();
        Set<EventUser> userSet = new HashSet<EventUser>();
        boolean bool = userSet.add(eventUser);
        //System.out.println(bool);
        Authority authorityUSER = new Authority(null, userSet, "USER");
        authorityRepository.save(authorityUSER);
        authorities.add(authorityUSER);
        EventUser user = new EventUser(eventUser.getName()
                , eventUser.getSurname()
                , eventUser.getUsername()
                , eventUser.getPassword()
                , eventUser.getEvents()
                , eventUser.getLastEventID()
                , authorities);

        //user.addAuthorities(eventUser, "USER");
        userRepository.save(user);
        return new MessageResponse("WELCOME, You registered successfully!", MessageType.SUCCESS);

    }

    public MessageResponse updateEvent(Long id, Event event) {
        Event eventFromDB = eventRepository.findEventById(id);

        if (eventFromDB != null) {
            eventFromDB.setTitle(event.getTitle());

            eventFromDB.setStartDate(event.getStartDate());

            eventFromDB.setFinishDate(event.getFinishDate());

            eventFromDB.setUsers(event.getUsers());

            eventFromDB.setQuota(event.getQuota());
            eventRepository.save(eventFromDB);
            return new MessageResponse(String.format("Event whose title is %d sucessfully updated!", id), MessageType.SUCCESS);
        }
        return new MessageResponse(String.format("Event whose id is %d not found!", id), MessageType.ERROR);


    }


    public List<EventUser> listAllUser() {
        return userRepository.findAll();
    }


    public List<Event> listAllEvents() {
        return eventRepository.findAll();
    }

    public EventUser getUserByTcKimlikNo(String tcKimlikNo) {
        return userRepository.findByTcKimlikNo(tcKimlikNo);
    }

    public MessageResponse addEventToUser(EventUser user) {
        boolean isJoined = false;
        EventUser userFromDB = userRepository.findByTcKimlikNo(user.getTcKimlikNo());
        Event eventToAdd = eventRepository.findEventById(user.getLastEventID());
        //System.out.println(userFromDB.getId());

        if (eventToAdd.isEventSoldOut()) {
            return new MessageResponse("Event is already sold out!", MessageType.ERROR);

        } else {
            if (userFromDB != null/*||user1.getEvents()!=null*/) {
                // For Each Loop for iterating ArrayList
                for (Event event1 : userFromDB.getEvents()) {
                    //System.out.println(event.getId()==eventUser.getLastEventID().longValue());
                    if (event1.getId().longValue() == user.getLastEventID().longValue()) {

                        isJoined = true;
                        break;
                    }

                }
                //System.out.println(isJoined);

                if (!isJoined) {
                    //Belirtilien id li evente daha önce kaydolmamışsa(Başka eventlere kayıtlı olabilir)

                    //user a event eklendi
                    List<Event>events =userFromDB.getEvents();
                    events.add(eventToAdd);
                    userFromDB.setEvents(events);
                    userFromDB.setLastEventID(user.getLastEventID());
                    userRepository.save(userFromDB);

                    // event e de user eklendi

                    eventToAdd.addUserToEvent(userFromDB);
                    eventRepository.save(eventToAdd);
                    //System.out.println(eventToAdd.isEventSoldOut());
                    //updateStudent(eventUser.getTcKimlikNo(), eventUser);
                    List<EventUser> admins = adminService.listAllAdmins();
                    //use event as parameter
                    sendMessageToAdmin(admins,userFromDB,eventToAdd);
                    return new MessageResponse("Successfully registered for the event!", MessageType.SUCCESS);
                } else {
                    return new MessageResponse("You have already joined this event with the same Tc Kimlik Number!", MessageType.ERROR);
                }

            } else {
                //Herhangi bir event e ilk defa katılıyorsa
                //System.out.println(eventUser.getLastEventID());
                //user a event eklendi
                List<Event>events =userFromDB.getEvents();
                events.add(eventToAdd);
                userFromDB.setEvents(events);
                userRepository.save(userFromDB);

                updateEvent(user.getLastEventID(), eventToAdd);
                //Add student to repository
                //userRepository.save(user);

                return new MessageResponse("WELCOME, You registered your first event!", MessageType.SUCCESS);

            }
        }


/*
        if (userFromDB!=null && eventToAdd!=null){
            userFromDB.addEventToUser(eventToAdd);
            userRepository.save(userFromDB);
            return new MessageResponse(String.format("Successfully joined to event!"), MessageType.SUCCESS);

        }
*/

        //return new MessageResponse(String.format("User or event could not found!"), MessageType.ERROR);


    }

    private void sendMessageToAdmin(List<EventUser> admins, EventUser userFromDB, Event eventToAdd) {
        String [] adminMessage = new String[4];

        adminMessage[0] = userFromDB.getName();
        adminMessage[1] = userFromDB.getSurname();
        adminMessage[2] = userFromDB.getTcKimlikNo();
        adminMessage[3] = eventToAdd.getTitle();


        UserDTO user= userMapper.mapToDto(userFromDB);
        try {
            admins.stream().forEach(admin -> simpMessagingTemplate.convertAndSend("/topic/joinEvent/"+admin.getTcKimlikNo(),adminMessage[0]+" "+adminMessage[1]+" joined to "+adminMessage[3]));

        }catch (Exception e){
            System.out.println(e);
        }


    }

    public List<Event> getUserEvent(String tcKimlikNo) {
       EventUser user = userRepository.findByTcKimlikNo(tcKimlikNo);

       return user.getEvents();
    }
}


