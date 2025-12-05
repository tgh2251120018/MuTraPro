package com.duay.authservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/content")
public class ContentController {

    /**
     * This endpoint is protected by Spring Security's
     * .anyRequest().authenticated() rule. It demonstrates that It returns a
     * simple HTML string as the response body.
     *
     * @return A ResponseEntity containing the HTML content.
     */
    @GetMapping("/welcome-page")
    public ResponseEntity<String> getWelcomePage() {
        // Create the HTML content as a Java String
        String htmlContent = "<html>"
                + "  <body style='font-family: sans-serif; text-align: center; margin-top: 50px;'>"
                + "    <h1>Chào mừng bạn đã xác thực thành công! 🎉</h1>"
                + "  </body>"
                + "</html>";

        // Return the HTML string with an OK (200) status
        return ResponseEntity.ok(htmlContent);
    }
}
