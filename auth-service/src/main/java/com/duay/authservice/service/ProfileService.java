package com.duay.authservice.service;

import org.springframework.stereotype.Service;

import com.duay.authservice.model.Auth.User;
import com.duay.authservice.model.Profile.Role;
import com.duay.authservice.model.Profile.UserProfile;
import com.duay.authservice.repository.UserProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository userProfileRepository;

    public boolean CreateProfile(User user) {
        var userProfile = UserProfile.builder()
                .user(user)
                .role(Role.CUSTOMER)
                .build();
        userProfileRepository.save(userProfile);
        return true;
    }

}
