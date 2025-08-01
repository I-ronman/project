package com.Ironman.back.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Ironman.back.entity.UserInfoEntity;

public interface UserInfoRepository extends JpaRepository<UserInfoEntity, Long> {
	
	Optional<UserInfoEntity> findByEmail(String email);
	
}
