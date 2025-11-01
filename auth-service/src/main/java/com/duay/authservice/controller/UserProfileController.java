// package com.duay.authservice.controller;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.duay.authservice.dto.UserProfileResponse;
// import com.duay.authservice.service.UserProfileService;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("public/profile") //public endpoint, can be accessed without authentication
// @RequiredArgsConstructor
// public class UserProfileController {

//     private final UserProfileService service;

//     @GetMapping("")
//     public ResponseEntity<UserProfileResponse> getUserProfileByUserName(
//             @RequestParam("username") String username
//     ) {
//         return ResponseEntity.ok(service.getUserProfileByUsername(username));
//     }

//     // @GetMapping("")
//     // public String getMethodName(@RequestParam String param) {
//     //     return new String();
//     // }
// }
