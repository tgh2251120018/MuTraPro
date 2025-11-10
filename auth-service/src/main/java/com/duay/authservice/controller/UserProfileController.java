package com.duay.authservice.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duay.authservice.dto.UserProfileResponse;
import com.duay.authservice.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("user-profile/public") //public endpoint, can be accessed without authentication
@RequiredArgsConstructor
public class UserProfileController {

    private final ProfileService service;

    @GetMapping("/{user_id}")
    public ResponseEntity<UserProfileResponse> getUserProfileByUserName(
            @PathVariable("user_id") UUID userID
    ) {
        return ResponseEntity.ok(service.getUserProfileByID(userID));
    }

    // @GetMapping("")
    // public String getMethodName(@RequestParam String param) {
    //     return new String();
    // }
}
