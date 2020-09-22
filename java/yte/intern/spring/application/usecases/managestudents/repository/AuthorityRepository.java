package yte.intern.spring.application.usecases.managestudents.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import yte.intern.spring.application.usecases.managestudents.entity.Authority;

public interface AuthorityRepository extends JpaRepository<Authority, Long> {
}