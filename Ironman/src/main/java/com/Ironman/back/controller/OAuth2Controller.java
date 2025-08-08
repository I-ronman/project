package com.Ironman.back.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.Ironman.back.dto.UserDto;
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.UserRepository;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class OAuth2Controller {
	
	private final UserRepository userRepository;

    @GetMapping("/oauth/success")
    public void oauthSuccess(@AuthenticationPrincipal OAuth2User oAuth2User,
                             HttpServletResponse response,
                             HttpSession session) throws IOException {

    	String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");

        // ✅ DB에서 해당 이메일 유저 찾기
        UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
            // 없으면 새로 생성해서 저장
            UserEntity newUser = new UserEntity();
            newUser.setEmail(email);
            newUser.setName(name);
            return userRepository.save(newUser);
        });

        // ✅ 세션에 user 저장 (일반 로그인과 동일하게)
        session.setAttribute("user", user);
        response.sendRedirect("http://localhost:5173/main");

    }


    //  프론트에서 유저 정보 요청 (axios.get)

    @GetMapping("/oauth/userinfo")
    @ResponseBody
    public Map<String, Object> getUserInfo(HttpSession session) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("name", session.getAttribute("name"));
        userInfo.put("email", session.getAttribute("email"));
        userInfo.put("email_verified", true);
        return userInfo;
    }
    
    @GetMapping("/login")
    public void handleLoginError(HttpServletResponse response) throws IOException {
        response.sendRedirect("http://localhost:5173/login?error=true");
    }

    
}

