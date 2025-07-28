package com.Ironman.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.Ironman.back.dto.UserDto;
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.service.LoginService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class LoginController {
	
	private final LoginService loginService;
	
	@PostMapping("/login")
	public ResponseEntity<UserDto> login(@RequestBody UserDto dto) {
		UserEntity user = loginService.login(dto.getEmail(), dto.getPw());
		
		// 로그인 성공 시 사용자 정보 반환
		return ResponseEntity.ok(UserDto.from(user));
	
	}
	
}
