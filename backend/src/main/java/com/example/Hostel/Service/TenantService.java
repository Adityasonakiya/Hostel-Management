package com.example.Hostel.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Hostel.Entities.Room;
import com.example.Hostel.Entities.Tenant;
import com.example.Hostel.Repository.RoomRepository;
import com.example.Hostel.Repository.TenantRepository;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private RoomRepository roomRepository;

    public Tenant addTenant(Tenant tenant, String roomNumber) {

        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getOccupiedBeds() >= 4) {
            throw new RuntimeException("Room is full!");
        }

        room.setOccupiedBeds(room.getOccupiedBeds() + 1);
        tenant.setRoom(room);

        roomRepository.save(room);
        return tenantRepository.save(tenant);
    }

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
}

