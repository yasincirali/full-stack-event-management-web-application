package yte.intern.spring.application.usecases.managestudents.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import yte.intern.spring.application.usecases.common.MessageResponse;
import yte.intern.spring.application.usecases.managestudents.dto.EventDTO;
import yte.intern.spring.application.usecases.managestudents.dto.UserDTO;
import yte.intern.spring.application.usecases.managestudents.entity.Event;
import yte.intern.spring.application.usecases.managestudents.entity.EventUser;
import yte.intern.spring.application.usecases.managestudents.mapper.EventMapper;
import yte.intern.spring.application.usecases.managestudents.mapper.UserMapper;
import yte.intern.spring.application.usecases.managestudents.repository.EventRepository;
import yte.intern.spring.application.usecases.managestudents.service.AdminService;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class AdminController {
    private final UserMapper userMapper;
    private final EventMapper eventMapper;
    private final AdminService adminService;
    private final EventRepository eventRepository;

    @RequestMapping(value="/addAdmin",method= RequestMethod.POST)
    public MessageResponse addAdmin(@Valid @RequestBody UserDTO userDTO) {
        //authority leri burada USER set edilecek(ADMİN postmanden USER ADMIN)
        EventUser eventUser = userMapper.mapToEntity(userDTO);
        return adminService.addAdmin(eventUser);
    }
    @GetMapping("/getAdmin")
    public List<UserDTO> ListAllAdmins() {
        List<EventUser> eventUsers = adminService.listAllAdmins();
        return userMapper.mapToDto(eventUsers);
    }
    @RequestMapping(value="/createEvent",method= RequestMethod.POST)
    public MessageResponse createEvent( @RequestBody EventDTO eventDTO) {

        Event event= eventMapper.mapToEntity(eventDTO);
        return adminService.createEvent(event);
    }
    //Get event metodları yaz (view kısmında kullanılacak)/viewEventte /events id ile fetch ediyor axios yapıp, nu işlemi adminControllerdan sağla

    @PutMapping("/modifyEvent/{id}")
    public MessageResponse modifyEvent(@PathVariable Long id, @RequestBody EventDTO eventDTO){
        Event event = eventMapper.mapToEntity(eventDTO);
        return adminService.updateEvent(id, event);

    }

    @GetMapping("/getEvents")
    public List<EventDTO> getAllEvents(){
        return eventMapper.mapToDto(eventRepository.findAll());
    }

    @DeleteMapping("/deleteEvent/{id}")
    public MessageResponse deleteEvent(@PathVariable Long id){
        return adminService.deleteEvent(id);
    }

}
