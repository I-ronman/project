package com.Ironman.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.Ironman.back.dto.UserDto;
import com.Ironman.back.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	
	@PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserDto dto){
		try {
			userService.signup(dto);
			return ResponseEntity.ok("회원가입 성공");
		} catch (ResponseStatusException e) {
			return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
		}
		

	}
	
}
