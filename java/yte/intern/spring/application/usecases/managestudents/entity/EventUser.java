package yte.intern.spring.application.usecases.managestudents.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import yte.intern.spring.application.usecases.common.entity.BaseEntity;

import javax.persistence.*;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@SequenceGenerator(name = "idgen", sequenceName = "USER_SEQ")
public class EventUser extends BaseEntity implements UserDetails {


    @Column(name = "NAME")
    private String name;

    @Column(name = "SURNAME")
    private String surname;

    //username işlevi görecek
    @Column(name = "TC_KIMLIK_NO", unique = true)
    private String tcKimlikNo;

    @Column(name = "PASSWORD")
    private String password;

    @ManyToMany(mappedBy = "users")
    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id")
    @JsonBackReference
    private List<Event> events = new ArrayList<>();

    @Column(name = "EVENT_ID")
    public Long lastEventID;

    public void addEventToUser(Event event){
        events.add(event);
    }

    public void deleteEventFromUser(Event event){
        this.events.remove(event);
    }



    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "USER_AUTHORITIES",
            joinColumns = @JoinColumn(name = "USER_ID"),
            inverseJoinColumns = @JoinColumn(name = "AUTHORITY_ID")
    )
    private Set<Authority> authorities;

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.tcKimlikNo;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
