package com.duay.authservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duay.authservice.model.Profile.UserProfile;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {

    // Find user by username
    Optional<UserProfile> findByUserDisplayName(String displayName);

}
