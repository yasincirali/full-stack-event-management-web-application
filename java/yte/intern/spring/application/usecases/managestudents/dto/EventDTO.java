package yte.intern.spring.application.usecases.managestudents.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import yte.intern.spring.application.usecases.managestudents.entity.Event;
import yte.intern.spring.application.usecases.managestudents.entity.EventUser;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

@Builder
public class EventDTO {

    @JsonProperty("id")
    public final Long id;

    @JsonProperty("title")
    @Size(max = 255, message = "Title can be at most 255 characters!")
    public final String title;

    @JsonProperty("finishDate")
    @PastOrPresent(message = "Publish date can't be in the future!")
    public final LocalDate finishDate;

    @JsonProperty("startDate")
    @PastOrPresent(message = "Publish date can't be in the past!")
    public final LocalDate startDate;

    @JsonProperty("users")
    public final List<EventUser> users;


    @JsonProperty("quota")
    public final int quota;


}
