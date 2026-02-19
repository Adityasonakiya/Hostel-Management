package com.example.Hostel.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Hostel.Entities.Room;
import com.example.Hostel.Entities.Tenant;
import com.example.Hostel.Service.TenantService;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class HostelController {

    @Autowired
    private TenantService tenantService;

    @PostMapping("/tenant/{roomNumber}")
    public Tenant addTenant(@RequestBody Tenant tenant,
                            @PathVariable String roomNumber) {
        return tenantService.addTenant(tenant, roomNumber);
    }

    @GetMapping("/tenants")
    public List<Tenant> getAllTenants() {
        return tenantService.getAllTenants();
    }

    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        return tenantService.getAllRooms();
    }
}

