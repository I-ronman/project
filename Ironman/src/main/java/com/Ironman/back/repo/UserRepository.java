package com.Ironman.back.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Ironman.back.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, String> {
	
	// 이메일 형식및 중복체크
	Optional<UserEntity> findByEmail(String email);
	
	// 이메일 + 비밀번호로 조회 (로그인용)
	UserEntity findByEmailAndPw(String email, String pw);

}
