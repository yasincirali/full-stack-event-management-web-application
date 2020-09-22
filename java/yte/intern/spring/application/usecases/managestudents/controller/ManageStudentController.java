package yte.intern.spring.application.usecases.managestudents.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import yte.intern.spring.application.usecases.common.MessageResponse;
import yte.intern.spring.application.usecases.managestudents.dto.EventDTO;
import yte.intern.spring.application.usecases.managestudents.dto.UserDTO;
import yte.intern.spring.application.usecases.managestudents.entity.Event;
import yte.intern.spring.application.usecases.managestudents.entity.EventUser;
import yte.intern.spring.application.usecases.managestudents.mapper.EventMapper;
import yte.intern.spring.application.usecases.managestudents.mapper.UserMapper;
import yte.intern.spring.application.usecases.managestudents.service.ManageUserService;

import java.util.List;

@RestController
//@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class ManageStudentController {

    private final UserMapper userMapper;


    private final ManageUserService manageUserService;


    //USER SIDE
    @GetMapping("/users")
    public List<UserDTO> listAllStudents(){
        List<EventUser> eventUsers = manageUserService.listAllUser();
        return userMapper.mapToDto(eventUsers);
    }

    @GetMapping("users/{tcKimlikNo}")
    public UserDTO getStudentByStudentNumber(@PathVariable String tcKimlikNo){
        EventUser eventUser = manageUserService.getUserByTcKimlikNo(tcKimlikNo);
        return userMapper.mapToDto(eventUser);
    }

    @PostMapping("/users")
    public MessageResponse addStudent(@RequestBody UserDTO userDTO){
        //System.out.println(userDTO.lastEventID);
        EventUser eventUser = userMapper.mapToEntity(userDTO);

        return manageUserService.addStudent(eventUser);
    }

    @PutMapping("/users/{tcKimlikNo}")
    public void updateStudent(@PathVariable String tcKimlikNo,@RequestBody UserDTO userDTO){
        EventUser eventUser = userMapper.mapToEntity(userDTO);
        manageUserService.updateStudent(tcKimlikNo, eventUser);
    }

    @DeleteMapping("/users/{tcKimlikNo}")
    public MessageResponse deleteStudent(@PathVariable String tcKimlikNo){
        return manageUserService.deleteUser(tcKimlikNo);
    }

    //EVENT SIDE ADMIN İŞLERİ BURADA OLACAK
    private final EventMapper eventMapper;

    @RequestMapping (value="/events",method=RequestMethod.POST)
    public MessageResponse addEvent(@RequestBody EventDTO eventDTO){
        Event event = eventMapper.mapToEntity(eventDTO);
        return manageUserService.addEvent(event);
    }

    @GetMapping("/events")
    public List<EventDTO> listAllEvents(){
        List<Event>  events= manageUserService.listAllEvents();
        return eventMapper.mapToDto(events);
    }
    @GetMapping("events/{id}")
    public EventDTO getStudentByStudentNumber(@PathVariable Long id){
        Event event = manageUserService.getEventById(id);
        return eventMapper.mapToDto(event);
    }
    @DeleteMapping("/events/{id}")
    public MessageResponse deleteEvent(@PathVariable Long id){
       return manageUserService.deleteEvent(id);
    }

    @PutMapping("/events/{id}")
    public void updateEvent(@PathVariable Long id,@RequestBody EventDTO eventDTO){
        Event event = eventMapper.mapToEntity(eventDTO);
        manageUserService.updateEvent(id, event);
    }


}
