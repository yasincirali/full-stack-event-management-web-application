package yte.intern.spring.application;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
//import yte.intern.spring.application.usecases.managestudents.service.DatabasePopulator;

import javax.annotation.PostConstruct;
//@RequiredArgsConstructor
@SpringBootApplication(exclude ={SecurityAutoConfiguration.class})
public class Application {

	//private final DatabasePopulator databasePopulator;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
	/*
	@PostConstruct
	public void populateDatabase(){
		databasePopulator.populateDatabase();
	}*/


}
