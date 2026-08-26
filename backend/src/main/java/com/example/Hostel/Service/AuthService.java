package com.example.Hostel.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Hostel.Entities.User;
import com.example.Hostel.Exceptions.DuplicateDataException;
import com.example.Hostel.Repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;


    public AuthService(UserRepository userRepository,PasswordEncoder encoder){
        this.userRepository=userRepository;
        this.encoder=encoder;
    }

    public String register(User user){
        boolean check=userRepository.existsByName(user.getName());
        if(check)
            throw new DuplicateDataException("User name already taken: "+user.getName());

        User newUser=new User();
        newUser.setName(user.getName());
        newUser.setPassword(encoder.encode(user.getPassword()));
        newUser.setEnabled(true);

        userRepository.save(newUser);
        return "User Saved Successfully!";
    }
}
