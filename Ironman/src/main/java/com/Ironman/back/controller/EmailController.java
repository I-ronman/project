package com.Ironman.back.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Ironman.back.service.EmailService;

@RestController
@RequestMapping("/email")
public class EmailController {

	private final EmailService emailService;
	private final Map<String, String> emailCodeMap = new HashMap<>();
			
			public EmailController(EmailService emailService) {
				this.emailService = emailService;
	}
	
	// 인증코드 발송
	@PostMapping("/send")
	public ResponseEntity<?> sendEmail(@RequestBody Map<String, String> request) {
	 String email = request.get("email");

	//  1. 형식 검사
	 if (!emailService.isValidEmail(email)) {
	        return ResponseEntity.badRequest().body("올바르지 않은 이메일 형식입니다.");
	    }
	 //  3. 실제 인증코드 발송
	 String code = emailService.sendVerificationCode(email);
		emailCodeMap.put(email, code);

		return ResponseEntity.ok("이메일 전송 완료");
			}
	
	// 인증코드 확인
	@PostMapping("/verify")
	public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
	    String email = request.get("email");
	    String inputCode = request.get("code");


	    //  핵심 수정: 서비스 메서드로 인증 처리

	    boolean verified = emailService.verifyCode(email, inputCode);

	    if (verified) {
	        return ResponseEntity.ok("인증 성공");
	    } else {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
	    }
	}
	// 인증 상태 초기화 (페이지 나갈 때 호출)
	  @DeleteMapping("/clear")
	   public ResponseEntity<?> clearEmailAuth(@RequestParam String email) {
			     emailService.clearVerification(email);
			     return ResponseEntity.ok("인증 상태 초기화 완료");			
			        
			    
	  }
			    
}