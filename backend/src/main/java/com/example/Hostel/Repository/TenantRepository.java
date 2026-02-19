package com.example.Hostel.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Hostel.Entities.Room;
import com.example.Hostel.Entities.Tenant;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    List<Tenant> findByRoom(Room room);
}

