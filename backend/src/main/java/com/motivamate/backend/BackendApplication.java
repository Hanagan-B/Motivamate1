package com.motivamate.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.motivamate.backend.model.User;
import com.motivamate.backend.repository.UserRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
	@Bean
CommandLineRunner init(UserRepository userRepo) {
    return args -> {
        if (!userRepo.existsById((long) 1)) {
            User user = new User();
            user.setId(1L);
            user.setName("Default User");
            user.setXp(0);
            userRepo.save(user);
        }
    };
}

}

