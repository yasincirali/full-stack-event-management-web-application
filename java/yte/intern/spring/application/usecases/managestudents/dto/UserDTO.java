package yte.intern.spring.application.usecases.managestudents.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import yte.intern.spring.application.usecases.managestudents.entity.Authority;
import yte.intern.spring.application.usecases.managestudents.entity.Event;
import yte.intern.spring.application.usecases.managestudents.validation.TcKimlikNo;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Set;

@Builder

public class UserDTO {
    @JsonProperty("name")
    @Size(max = 255, message = "Name can't be longer than 255!")
    public final String name;

    @JsonProperty("surname")
    @Size(max = 255, message = "Surname can't be longer than 255!")
    public final String surname;


    @JsonProperty("tcKimlikNo")
    @Size(min = 11, max = 11, message = "TC Kimlik no must be 11 characters long!")
    @TcKimlikNo(message = "TC Kimlik No must be valid!")
    public final String tcKimlikNo;

    @JsonProperty("password")
    public final String password;

    @JsonProperty("events")
    public final List<Event> events;

    @JsonProperty("event_id")
    public final Long lastEventID;


    @JsonProperty("authorities")
    public final Set<Authority> authorities;

}
