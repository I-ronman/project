package com.Ironman.back.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Ironman.back.entity.UserInfoEntity;

public interface UserInfoRepository extends JpaRepository<UserInfoEntity, Integer> {
	
}
