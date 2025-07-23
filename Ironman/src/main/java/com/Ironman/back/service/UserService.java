package com.Ironman.back.service;

import org.springframework.stereotype.Service;

import com.Ironman.back.dto.UserDto;
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

		private final UserRepository userRepository;
		
		public void signup(UserDto dto) {
			UserEntity user = dto.toEntity();
			userRepository.save(user);
		}
}
