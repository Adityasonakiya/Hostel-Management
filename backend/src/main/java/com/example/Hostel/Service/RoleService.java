package com.example.Hostel.Service;

import org.springframework.stereotype.Service;

import com.example.Hostel.Entities.Roles;
import com.example.Hostel.Repository.RoleRepository;


@Service
public class RoleService {

    private RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public void addRole(Roles role) {
        roleRepository.save(role);
    }
}