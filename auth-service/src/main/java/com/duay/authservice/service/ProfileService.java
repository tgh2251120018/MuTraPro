package com.duay.authservice.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.duay.authservice.dto.UserProfileResponse;
import com.duay.authservice.exception.ResourceNotFoundException;
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

    public UserProfileResponse getUserProfileByID(UUID userID) {
        var userProfile = userProfileRepository.findById(userID)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile not found for user"));
        return UserProfileResponse.builder()
                .displayName(userProfile.getUserDisplayName())
                .role(userProfile.getRole().toString())
                .build();
    }
}
