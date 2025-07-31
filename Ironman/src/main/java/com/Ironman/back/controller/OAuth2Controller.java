package com.Ironman.back.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Controller
public class OAuth2Controller {

    @GetMapping("/oauth/success")
    public void oauthSuccess(@AuthenticationPrincipal OAuth2User oAuth2User,
                             HttpServletResponse response,
                             HttpSession session) throws IOException {

        session.setAttribute("name", oAuth2User.getAttribute("name"));
        session.setAttribute("email", oAuth2User.getAttribute("email"));

        // ✅ 로그인 성공 후 프론트로 이동

        response.sendRedirect("http://localhost:5173/main");
        System.out.println("👉 oauthSuccess() 실행됨");

    }


    // ✅ 프론트에서 유저 정보 요청 (axios.get)

    @GetMapping("/oauth/userinfo")
    @ResponseBody
    public Map<String, Object> getUserInfo(HttpSession session) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("name", session.getAttribute("name"));
        userInfo.put("email", session.getAttribute("email"));
        userInfo.put("email_verified", true);
        return userInfo;
    }
}

