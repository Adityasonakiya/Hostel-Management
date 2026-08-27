package com.example.Hostel.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Hostel.Entities.Roles;

public interface RoleRepository extends JpaRepository<Roles,Long> {
    Optional<Roles> findByName(String name);
}
