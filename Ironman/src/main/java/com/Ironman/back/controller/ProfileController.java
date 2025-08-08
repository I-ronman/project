package com.Ironman.back.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.service.ProfileService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class ProfileController {
	
	private final ProfileService profileService;
	
	@PostMapping("/profile")
	public ResponseEntity<?> updateProfileImage(@RequestBody Map<String, String> request, HttpSession session){
		UserEntity user = (UserEntity) session.getAttribute("user");
		if (user == null) {
			return ResponseEntity.status(401).body("로그인이 필요합니다.");
		}
		
		String face = request.get("face");
		if (face == null || face.isEmpty()) {
			return ResponseEntity.badRequest().body("이미지 데이터가 없습니다.");
		}
		
		profileService.updateFace(user.getEmail(), face);
		
		return ResponseEntity.ok("프로필 이미지 저장 완료");
				
	}
}
