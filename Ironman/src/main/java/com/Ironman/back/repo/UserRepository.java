package com.Ironman.back.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Ironman.back.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
	
	// 이메일로 사용자 조회
	UserEntity findByEmail(String email);
	
	// 이메일 + 비밀번호로 조회 (로그인용)
	UserEntity findByEmailAndPw(String email, String pw);
}
