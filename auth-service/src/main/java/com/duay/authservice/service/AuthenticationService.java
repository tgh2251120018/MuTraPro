package com.duay.authservice.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duay.authservice.dto.AuthenticationRequest;
import com.duay.authservice.dto.AuthenticationResponse;
import com.duay.authservice.dto.RegisterRequest;
import com.duay.authservice.dto.RegisterResponse;
import com.duay.authservice.extra.RegisterResultCode;
import com.duay.authservice.model.Auth.AccountType;
import com.duay.authservice.model.Auth.User;
import com.duay.authservice.repository.UserCredentialRepository;
import com.duay.authservice.repository.UserProfileRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserCredentialRepository userCredentialRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ProfileService profileService;

    /**
     * Register Function
     *
     */
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .accountType(AccountType.USER)
                .build();

        userCredentialRepository.save(user);
        profileService.CreateProfile(user);

        return RegisterResponse.builder()
                .resultCode(RegisterResultCode.SUCCESS)
                .build();
    }

    /**
     * Authentication Function
     *
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userCredentialRepository.findByUsername(request.getUsername())
                .orElseThrow();
        var userProfile = userProfileRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("UserProfile not found for user"));
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("account_type", user.getAccountType());
        extraClaims.put("role", userProfile.getRole());
        var jwtToken = jwtService.generateToken(extraClaims, user);
        // var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    // public Map<String, String> authenticate(AuthenticationRequest request) {
    //     authenticationManager.authenticate(
    //             new UsernamePasswordAuthenticationToken(
    //                     request.getUsername(),
    //                     request.getPassword()
    //             )
    //     );
    //     var user = userCredentialRepository.findByUsername(request.getUsername())
    //             .orElseThrow();
    //     var jwtToken = jwtService.generateToken(user);
    //     var refreshToken = jwtService.generateRefreshToken(user);
    //     return Map.of("accessToken", jwtToken, "refreshToken", refreshToken);
    // }
    // public AuthenticationResponse authenticate(AuthenticationRequest request) {
    //         // BƯỚC 1: Xác thực người dùng.
    //         // Nếu thông tin đăng nhập không đúng, dòng này sẽ ném ra ngoại lệ
    //         // AuthenticationException. Bạn cần xử lý ngoại lệ này ở tầng cao hơn
    //         // hoặc để Spring Security xử lý mặc định (thường trả về lỗi 401 Unauthorized).
    //         authenticationManager.authenticate(
    //                 new UsernamePasswordAuthenticationToken(
    //                         request.getUsername(),
    //                         request.getPassword()
    //                 )
    //         );
    //         // BƯỚC 2: Tìm người dùng trong cơ sở dữ liệu sau khi xác thực thành công.
    //         // .orElseThrow() sẽ ném ra NoSuchElementException nếu không tìm thấy,
    //         // nhưng sau khi xác thực thành công thì thường là tìm thấy.
    //         var user = userCredentialRepository.findByUsername(request.getUsername())
    //                 .orElseThrow(() -> new RuntimeException("User not found after authentication")); // Thêm thông báo rõ ràng hơn
    //         // BƯỚC 3: TẠM THỜI BYPASS VIỆC TẠO VÀ TRẢ VỀ JWT
    //         // Các dòng này đã được bạn comment.
    //         // var jwtToken = jwtService.generateToken(user);
    //         // var refreshToken = jwtService.generateRefreshToken(user);
    //         // BƯỚC 4: Trả về một AuthenticationResponse đơn giản để kiểm tra.
    //         // Thay vì user(""), bạn có thể trả về một chuỗi nào đó đại diện cho user
    //         // hoặc null nếu AuthenticationResponse cho phép.
    //         // Tốt nhất là trả về một giá trị có ý nghĩa để xác nhận debug.
    //         return AuthenticationResponse.builder()
    //                 // .accessToken(jwtToken) // Comment lại
    //                 // .refreshToken(refreshToken) // Comment lại
    //                 // Đặt một giá trị debug tại đây, ví dụ: tên người dùng
    //                 .user(user.getUsername()) // Giả sử user có phương thức getUsername()
    //                 .build();
    //     }
    // Làm mới token
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String username;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        username = jwtService.extractUserId(refreshToken);
        if (username != null) {
            var user = this.userCredentialRepository.findByUsername(username)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) { // Kiểm tra Refresh Token có hợp lệ không
                var accessToken = jwtService.generateToken(user); // Tạo Access Token mới
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken) // Giữ nguyên Refresh Token cũ hoặc tạo mới nếu muốn
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse); // Ghi response
            }
        }
    }

    public void deleteUser(String username) {
        var user = userCredentialRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userCredentialRepository.delete(user); // Xóa người dùng khỏi DB
    }
}
