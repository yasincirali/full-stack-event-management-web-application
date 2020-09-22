package yte.intern.spring.application.usecases.managestudents.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yte.intern.spring.application.usecases.common.MessageResponse;
import yte.intern.spring.application.usecases.common.enums.MessageType;
import yte.intern.spring.application.usecases.managestudents.entity.Authority;
import yte.intern.spring.application.usecases.managestudents.entity.Event;
import yte.intern.spring.application.usecases.managestudents.entity.EventUser;
import yte.intern.spring.application.usecases.managestudents.repository.AuthorityRepository;
import yte.intern.spring.application.usecases.managestudents.repository.EventRepository;
import yte.intern.spring.application.usecases.managestudents.repository.UserRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final EventRepository eventRepository;

    public MessageResponse addAdmin(EventUser eventUser) {
        Set<Authority> authorities = new HashSet<Authority>();
        Set<EventUser> userSet = new HashSet<EventUser>();
        boolean bool = userSet.add(eventUser);
        //System.out.println(bool);
        Authority authorityUSER = new Authority(null, userSet, "ADMIN");
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
        return new MessageResponse("Congrats, ADMIN registered successfully!", MessageType.SUCCESS);


    }

    public List<EventUser> listAllAdmins() {
        //List<EventUser> users = userRepository.findAll();
        //List<EventUser> admins = new ArrayList<>();
       /* for (EventUser user : users) {
            List<String> authorityList = new ArrayList<>();
            user.getAuthorities().forEach(i -> authorityList.add(i.getAuthority()));
            if (authorityList.get(0).equals("ADMIN")) {
                admins.add(user);
            }
        }
        */
        return userRepository.findByAuthorities_Authority("ADMIN");

    }

    public MessageResponse createEvent(Event event) {
        List<Event> eventList = eventRepository.findAll();
        boolean isExist = false;
        for (Event event1 : eventList) {
            if (event1.getTitle().equals(event.getTitle())) {
                isExist = true;
            }
        }
        if (!isExist) {
            eventRepository.save(event);
            return new MessageResponse("Event sucessfully added!", MessageType.SUCCESS);
        } else {
            return new MessageResponse("Event already added with the same name!", MessageType.ERROR);

        }
    }

    @Transactional
    public MessageResponse deleteEvent(Long id) {
        Event eventDeleted = eventRepository.findEventById(id);

        //Silinen eventi userda da silmek için
        List<EventUser> users = userRepository.findAll();
        for (EventUser userTraversed : users) {

            if (userTraversed.getEvents() != null) {
                System.out.println(userTraversed.getEvents().size());
                List<Event> list = userTraversed.getEvents();
                Iterator<Event> iterator = list.iterator();
                while (iterator.hasNext()) {
                    Event event = iterator.next();
                    if (event.getId().longValue() == id) {
                        iterator.remove();
                    }
                }
            }
            System.out.println(userTraversed.getName() + " " + userTraversed.getEvents().size());

        }
        eventRepository.deleteEventById(id);

        return new MessageResponse(String.format("Event with name %s is successfully deleted!", eventDeleted.getTitle()), MessageType.SUCCESS);


    }

    public MessageResponse updateEvent(Long id, Event event) {
        Event eventFromDB = eventRepository.findEventById(id);

        if (eventFromDB != null) {
            eventFromDB.setTitle(event.getTitle());

            eventFromDB.setStartDate(event.getStartDate());

            eventFromDB.setFinishDate(event.getFinishDate());

            //eventFromDB.setUsers(event.getUsers());

            eventFromDB.setQuota(event.getQuota());
            eventRepository.save(eventFromDB);
            return new MessageResponse(String.format("Event whose title is %d sucessfully updated!", id), MessageType.SUCCESS);
        }
        return new MessageResponse(String.format("Event whose id is %d not found!", id), MessageType.ERROR);

    }
}
