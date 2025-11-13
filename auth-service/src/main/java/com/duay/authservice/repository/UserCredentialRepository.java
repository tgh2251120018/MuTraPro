package com.duay.authservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duay.authservice.model.Auth.User;

@Repository
public interface UserCredentialRepository extends JpaRepository<User, UUID> {

    // Find user by username
    Optional<User> findByUsername(String username);

    // Check if a user exists by username
    boolean existsByUsername(String username);

    // Check if a user exists by email
    boolean existsByEmail(String email);

}
