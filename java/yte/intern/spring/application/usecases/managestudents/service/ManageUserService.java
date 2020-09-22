package yte.intern.spring.application.usecases.managestudents.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yte.intern.spring.application.usecases.common.MessageResponse;
import yte.intern.spring.application.usecases.common.enums.MessageType;
import yte.intern.spring.application.usecases.managestudents.entity.Event;
import yte.intern.spring.application.usecases.managestudents.entity.EventUser;
import yte.intern.spring.application.usecases.managestudents.repository.EventRepository;
import yte.intern.spring.application.usecases.managestudents.repository.UserRepository;

import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ManageUserService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageResponse addStudent(EventUser eventUser) {
        boolean isJoined = false;
        EventUser user1 = userRepository.getUserByTcKimlikNo(eventUser.getTcKimlikNo());
        Event event = eventRepository.findEventById(eventUser.lastEventID);

        System.out.println(user1 == null);

        if (event.isEventSoldOut()) {
            return new MessageResponse("Event is already sold out!", MessageType.ERROR);

        } else {
            if (user1 != null/*||user1.getEvents()!=null*/) {
                // For Each Loop for iterating ArrayList
                for (Event event1 : user1.getEvents()) {
                    //System.out.println(event.getId()==eventUser.getLastEventID().longValue());
                    if (event1.getId().longValue() == eventUser.getLastEventID().longValue()) {

                        isJoined = true;
                        break;
                    }

                }
                //System.out.println(isJoined);

                if (!isJoined) {
                    //Belirtilien id li evente daha önce kaydolmamışsa(Başka eventlere kayıtlı olabilir)

                    //user a event eklendi
                    user1.addEventToUser(eventRepository.findEventById(eventUser.lastEventID));
                    userRepository.save(user1);

                    // event e de user eklendi

                    event.addUserToEvent(user1);
                    eventRepository.save(event);
                    System.out.println(event.isEventSoldOut());
                    //updateStudent(eventUser.getTcKimlikNo(), eventUser);
                    return new MessageResponse("Successfully registered for the event!", MessageType.SUCCESS);
                } else {
                    return new MessageResponse("You have already joined this event with the same Tc Kimlik Number!", MessageType.ERROR);
                }

            } else {
                //Herhangi bir event e ilk defa katılıyorsa
                //System.out.println(eventUser.getLastEventID());
                //user a event eklendi
                eventUser.addEventToUser(event);
                // event e de user eklendi
                event.addUserToEvent(eventUser);

                updateEvent(eventUser.lastEventID, event);

                //Add student to repository
                userRepository.save(eventUser);

                return new MessageResponse("WELCOME, You registered your first event!", MessageType.SUCCESS);

            }
        }
    }

    public List<EventUser> listAllUser() {
        return userRepository.findAll();
    }

    public EventUser getUserByTcKimlikNo(String tcKimlikNo) {
        return userRepository.findByTcKimlikNo(tcKimlikNo);
    }

    //@Transactional yazarsak o metodda geçen tüm modifying işlemlerini aynı anda yapar
    //Formdan gelecek olan yeni student objesi ile update edilir
    public MessageResponse updateStudent(String tcKimlikNo, EventUser eventUser) {
        System.out.println(eventUser.getTcKimlikNo());
        EventUser eventUserFromDB = userRepository.findByTcKimlikNo(eventUser.getTcKimlikNo());

        if (eventUserFromDB != null) {
            updateStudentFields(eventUser, eventUserFromDB);
            userRepository.save(eventUserFromDB);
            return new MessageResponse(String.format("User whose TC kimlik no is %s sucessfully updated!", tcKimlikNo), MessageType.SUCCESS);
        }
        return new MessageResponse(String.format("User whose TC kimlik no is %s not found!", tcKimlikNo), MessageType.ERROR);
    }

    public MessageResponse deleteUser(String tcKimlikNo) {
        userRepository.deleteByTcKimlikNo(tcKimlikNo);
        return new MessageResponse(String.format("User whose TC Kimlik No is %s is deleted!", tcKimlikNo), MessageType.SUCCESS);

    }

    public MessageResponse addEvent(Event event) {
        eventRepository.save(event);
        return new MessageResponse("Event sucessfully added!", MessageType.SUCCESS);
    }

    public List<Event> listAllEvents() {
        return eventRepository.findAll();
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
            /*
            if (userTraversed.getEvents().size() == 0) {
                userRepository.deleteById(userTraversed.getId());

                System.out.println("BURAYA GİRDİ");
            }

             */


        }
        eventRepository.deleteEventById(id);




        /*
        if(user!=null)
            userRepository.deleteByTcKimlikNo(user.getTcKimlikNo());

         */
        return new MessageResponse(String.format("Event whose id is %s is deleted!", id), MessageType.SUCCESS);

    }

    private void updateStudentFields(EventUser eventUser, EventUser eventUserFromDB) {
        eventUserFromDB.setName(eventUser.getName());

        eventUserFromDB.setSurname(eventUser.getSurname());

        eventUserFromDB.setTcKimlikNo(eventUser.getTcKimlikNo());

        eventUserFromDB.setEvents(eventUser.getEvents());
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

    public Event getEventById(Long id) {
        return eventRepository.findEventById(id);
    }
}
