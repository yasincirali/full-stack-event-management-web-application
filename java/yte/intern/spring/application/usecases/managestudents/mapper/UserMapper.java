package yte.intern.spring.application.usecases.managestudents.mapper;

import org.mapstruct.Mapper;
import yte.intern.spring.application.usecases.managestudents.dto.UserDTO;
import yte.intern.spring.application.usecases.managestudents.entity.EventUser;

import java.util.List;
@Mapper(componentModel = "spring")

public interface UserMapper {

    EventUser mapToEntity(UserDTO userDTO);

    UserDTO mapToDto(EventUser eventUser);

    List<EventUser> mapToEntity(List<UserDTO> userDTOList);

    List<UserDTO> mapToDto(List<EventUser> eventUserList);

}
