package yte.intern.spring.application.usecases.managestudents.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import yte.intern.spring.application.usecases.managestudents.entity.Authority;
import yte.intern.spring.application.usecases.managestudents.entity.EventUser;

import javax.transaction.Transactional;
import java.util.List;

public interface UserRepository extends JpaRepository<EventUser,Long> {

    List<EventUser> findByAuthorities_Authority(String authority);

    EventUser getUserByTcKimlikNo(String tcKimlikNo);
    @Transactional
    void deleteByTcKimlikNo(String tcKimlikNo);

    EventUser getEventUserByLastEventID(Long id);

    EventUser findEventUserByTcKimlikNo(String tcKimlikNo);

    EventUser findByTcKimlikNo(String tcKimlikNo);

    @Query("SELECT u FROM EventUser u WHERE u.tcKimlikNo=?1")
    EventUser findAllByTcKimlikNo(String tcKimlikNo);

    List<EventUser> findAll();
}
