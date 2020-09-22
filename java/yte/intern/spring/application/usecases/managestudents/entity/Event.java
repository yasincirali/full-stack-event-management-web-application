package yte.intern.spring.application.usecases.managestudents.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.catalina.User;
import yte.intern.spring.application.usecases.common.entity.BaseEntity;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idgen", sequenceName = "EVENT_SEQ")
@AllArgsConstructor
@NoArgsConstructor
public class Event extends BaseEntity {

    @Column(name = "TITLE")
    private String title;

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "FINISH_DATE")
    private LocalDate finishDate;

    @Column(name = "QUOTA")
    private int quota;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST,CascadeType.REFRESH})
    @JoinTable(name = "USER_LIKE",
            joinColumns =@JoinColumn(name="event_id"),
            inverseJoinColumns = @JoinColumn(name="user_id"))
    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id")
    private List<EventUser> users= new ArrayList<>();

    public void addUserToEvent(EventUser eventUser){
        users.add(eventUser);
    }

    public void deleteUserFromEvent(EventUser eventUser){users.remove(eventUser); }


    public boolean isEventSoldOut() {
        return users.size() >= this.quota;
    }


}
