package com.Ironman.back.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.Ironman.back.dto.UserDto;
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.service.LoginService;
import com.Ironman.back.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class LoginController {
	
	private final LoginService loginService;
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody UserDto userDto, HttpSession session) {
	    UserEntity user = loginService.login(userDto.getEmail(), userDto.getPw());
	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 잘못되었습니다.");
	    }

	    // 세션에 사용자 정보 저장
	    session.setAttribute("user", user);
	    return ResponseEntity.ok().body(user);
	}
	
	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpSession session) {
	    session.invalidate(); // 세션 초기화
	    return ResponseEntity.ok("로그아웃 완료");
	}
	
	@GetMapping("/login/check")
	public ResponseEntity<?> checkLogin(HttpSession session) {
	    UserEntity user = (UserEntity) session.getAttribute("user");
	    if (user != null) {
	        return ResponseEntity.ok(Map.of("loggedIn", true, "email", user.getEmail()));
	    } else {
	        return ResponseEntity.ok(Map.of("loggedIn", false));
	    }
	}
	
	@GetMapping("/login/user")
	public ResponseEntity<?> getUserInfo(HttpSession session) {
	    UserEntity user = (UserEntity) session.getAttribute("user");
	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
	    }
	    return ResponseEntity.ok(Map.of("name", user.getName(), "email", user.getEmail()));
	}


}
