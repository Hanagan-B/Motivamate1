package com.motivamate.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.motivamate.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // You can add custom query methods if needed
}