package com.example.Hostel.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    String name;

    @Column(nullable = false)
    String password;

    boolean isEnabled;

    public User(String name, String password, boolean isEnabled) {
        this.name = name;
        this.password = password;
        this.isEnabled=isEnabled;
    }
}
