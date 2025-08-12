package com.Ironman.back.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Ironman.back.dto.SurveyDto;
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.UserInfoRepository;
import com.Ironman.back.service.UserInfoService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SurveyController {

    private final UserInfoService userInfoService;


    @PostMapping("/survey")
    public ResponseEntity<?> saveSurvey(@RequestBody SurveyDto dto, HttpSession session) {
    	System.out.println("✅ 설문 저장 요청 들어옴: " + dto);  // ← 로그 꼭 확인
    	UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }

        userInfoService.saveSurvey(user.getEmail(), dto);
        return ResponseEntity.ok("설문 저장 또는 수정 완료");
    }
    
    /** 내 설문 상세 조회 (폼 채우기용) */
    @GetMapping("/survey/me")
    public ResponseEntity<?> getMySurvey(HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }
        Optional<SurveyDto> surveyOpt = userInfoService.findSurveyByEmail(user.getEmail());
        if (surveyOpt.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204
        }
        return ResponseEntity.ok(surveyOpt.get());
    }

    /** 설문 완료 여부만 확인 (블라인드 토글용) */
    @GetMapping("/survey/status")
    public ResponseEntity<?> getMySurveyStatus(HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }
        boolean done = userInfoService.hasSurvey(user.getEmail());
        return ResponseEntity.ok(Map.of("done", done));
    }
}

