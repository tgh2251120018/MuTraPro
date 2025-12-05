package com.duay.authservice.dto;

import com.duay.authservice.extra.RegisterResultCode;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {

    @JsonProperty("resultCode")
    private RegisterResultCode resultCode;
    // @JsonProperty("username")
    // private String username;
    // @JsonProperty("email")
    // private String email;
}
