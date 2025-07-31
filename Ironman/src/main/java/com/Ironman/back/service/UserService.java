package com.Ironman.back.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.Ironman.back.dto.UserDto;
import com.Ironman.back.entity.RoutineEntity;
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.RoutineExerciseRepository;
import com.Ironman.back.repo.RoutineRepository;
import com.Ironman.back.repo.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	
	private final EmailService emailService;
	private final UserRepository userRepository;
	
	public void signup(UserDto dto) {
		// 이메일 중복 체크
		if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 가입된 이메일입니다.");
		}
		
		if (!emailService.isVerified(dto.getEmail())) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이메일 인증을 먼저 완료해주세요.");
	    }

		// 회원 저장
		  UserEntity user = UserEntity.builder()
			        .email(dto.getEmail())
			        .pw(dto.getPw())
			        .name(dto.getName())
			        .gender(dto.getGender())
			        .birthdate(dto.getBirthdate())
			        .build();
		  
		userRepository.save(user);
		
		// 회원가입후 인증 상태 초기화
		emailService.clearVerification(dto.getEmail());
	}
	
	

	
}
