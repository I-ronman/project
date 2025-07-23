package com.Ironman.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.Ironman.back.dto.UserDto;
import com.Ironman.back.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	
	@PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserDto dto){
		userService.signup(dto);
		return ResponseEntity.ok("회원가입 성공");

	}
	
}
