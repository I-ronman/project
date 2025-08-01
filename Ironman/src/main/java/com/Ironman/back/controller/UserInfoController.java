package com.Ironman.back.controller;

import com.Ironman.back.dto.UserInfoDto;
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.service.UserInfoService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserInfoController {

	private final UserInfoService userInfoService;
	
	@PostMapping("/survey")
	public ResponseEntity<?> saveUserInfo(@RequestBody UserInfoDto dto, HttpSession session){
		UserEntity user = (UserEntity) session.getAttribute("user");
		if (user == null) {
			return ResponseEntity.status(401).body("로그인이 필요합니다.");
		}
		
		userInfoService.saveUserInfo(dto, user.getEmail());
		return ResponseEntity.ok("설문 저장 완료");
	}
}
