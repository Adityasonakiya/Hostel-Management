package com.example.Hostel.Service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.Hostel.Entities.CustomUserDetails;
import com.example.Hostel.Entities.User;
import com.example.Hostel.Repository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService{

    private final UserRepository userRepository;

    public CustomUserDetailService(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user=userRepository.findByName(username).orElseThrow(
                ()-> new UsernameNotFoundException("User not found: "+username));
        
        return new CustomUserDetails(user);        
    }
    
}
