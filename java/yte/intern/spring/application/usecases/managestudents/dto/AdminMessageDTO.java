package yte.intern.spring.application.usecases.managestudents.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

@Builder
public class AdminMessageDTO {
    @JsonProperty("name")
    private  String name;

    @JsonProperty("surname")
    private  String surname;

    @JsonProperty("tcKimlikNo")
    private String tcKimlikNo;

    @JsonProperty("eventName")
    private String eventName;
}
