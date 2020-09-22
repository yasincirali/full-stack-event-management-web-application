package yte.intern.spring.application.usecases.managestudents.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import yte.intern.spring.application.usecases.common.MessageResponse;
import yte.intern.spring.application.usecases.common.enums.MessageType;
import yte.intern.spring.application.usecases.managestudents.dto.EventDTO;
import yte.intern.spring.application.usecases.managestudents.dto.UserDTO;
import yte.intern.spring.application.usecases.managestudents.entity.Event;
import yte.intern.spring.application.usecases.managestudents.entity.EventUser;
import yte.intern.spring.application.usecases.managestudents.mapper.EventMapper;
import yte.intern.spring.application.usecases.managestudents.mapper.UserMapper;
import yte.intern.spring.application.usecases.managestudents.service.UserService;

import javax.validation.Valid;
import java.util.Base64;
import java.util.List;

@RestController
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
public class UserController {
    private final UserMapper userMapper;
    private final EventMapper eventMapper;

    private final UserService userService;

    @RequestMapping(value="/addUser",method=RequestMethod.POST)
    public MessageResponse addUser(@Valid @RequestBody UserDTO userDTO) {
        //authority leri burada USER set edilecek(ADMİN postmanden USER ADMIN)

        EventUser eventUser = userMapper.mapToEntity(userDTO);
        return userService.addUser(eventUser);
    }

    @GetMapping("/getUser")
    public List<UserDTO> ListAllUsers() {
        List<EventUser> eventUsers = userService.listAllUser();
        return userMapper.mapToDto(eventUsers);
    }

    @GetMapping("/getUser/{tcKimlikNo}")
    public UserDTO GetUserByTcKimlikNo(@PathVariable String tcKimlikNo) {
        EventUser eventUser = userService.getUserByTcKimlikNo(tcKimlikNo);
        return userMapper.mapToDto(eventUser);
    }

    @GetMapping("/listEvents")
    public List<EventDTO> listAllEvents(){
        List<Event>  events= userService.listAllEvents();
        return eventMapper.mapToDto(events);
    }

    @RequestMapping(value="/tokenAuth",method=RequestMethod.POST)
    public MessageResponse isAuth(@RequestBody String token){

        return userService.tokenAuth(token);
    }

    @PutMapping("/addEventToUser")
    public MessageResponse addEventToUser(@RequestBody UserDTO userDTO){

        EventUser user = userMapper.mapToEntity(userDTO);
        //System.out.println(user.getLastEventID());

        return userService.addEventToUser(user);


    }
    @GetMapping("/getUserEvents/{tcKimlikNo}")
    public List<EventDTO> getUserEvent(@PathVariable String tcKimlikNo){

        //EventUser user = userMapper.mapToEntity(userDTO);
        //System.out.println(user.getLastEventID());

        return eventMapper.mapToDto(userService.getUserEvent(tcKimlikNo));


    }



}
