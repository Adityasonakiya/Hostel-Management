package com.example.Hostel.Entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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

    @ManyToMany
    @JoinTable(
        name = "user_roles",
        joinColumns=@JoinColumn(name="user_id"),
        inverseJoinColumns = @JoinColumn(name="role_id")
    )
    Set<Roles> roles=new HashSet<>();

    public User(String name, String password, boolean isEnabled) {
        this.name = name;
        this.password = password;
        this.isEnabled=isEnabled;
    }
}
