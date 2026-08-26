package com.example.Hostel.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Hostel.Entities.User;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByName(String name);
    boolean existsByName(String name);
}
