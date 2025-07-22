package com.Ironman.back.service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.Ironman.back.repo.UserRepository;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;
	
	 // 인증코드 저장 (email -> code)
    private final Map<String, String> emailCodeMap = new ConcurrentHashMap<>();

    // 인증 성공 여부 저장 (email -> true)
    private final Map<String, Boolean> emailVerifiedMap = new ConcurrentHashMap<>();
	
	public String sendVerificationCode(String toEmail) {
		String code = String.valueOf((int)(Math.random() * 900000) + 100000);
		
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(toEmail); // 사용자 이메일 (수신자)
		message.setSubject("회원가입 인증 코드");
		message.setText("인증 코드는" + code + " 입니다.");
		message.setFrom("spit115@naver.com");
		
		mailSender.send(message);
		emailCodeMap.put(toEmail, code); // 인증코드 저장
		return code;

	}
	
	// 인증코드 확인 및 인증 여부 저장
    public boolean verifyCode(String email, String inputCode) {
        String savedCode = emailCodeMap.get(email);
        if (savedCode != null && savedCode.equals(inputCode)) {
            emailVerifiedMap.put(email, true); // 인증 성공 표시
            return true;
        }
        return false;
    }
	
    // 인증된 코드인지 확인
    public boolean isVerified(String email) {
        return emailVerifiedMap.getOrDefault(email, false);
    }

    
    // 이메일 정규식 검사
    public boolean isValidEmail(String email) {
    	String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.(com|net|org|kr)$";
        return Pattern.matches(regex, email);
    }

    // 이메일 인증 및 코드 초기화
    public void clearVerification(String email) {
        emailVerifiedMap.remove(email);
        emailCodeMap.remove(email);
    }
    
    
}
