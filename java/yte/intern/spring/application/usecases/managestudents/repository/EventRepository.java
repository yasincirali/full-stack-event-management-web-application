package yte.intern.spring.application.usecases.managestudents.repository;

import org.mapstruct.Mapper;
import org.springframework.data.jpa.repository.JpaRepository;
import yte.intern.spring.application.usecases.managestudents.entity.Event;


import javax.transaction.Transactional;

public interface EventRepository extends JpaRepository<Event,Long> {


    Event findEventByTitle(String title);

    //o evente katılan user ları listelemek için
    //Event getEventByTckimlikNo(String tcKimlikNo);

    @Transactional
    void deleteEventById(Long id);


    Event findEventById(Long id);
}
