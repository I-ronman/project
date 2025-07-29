package com.Ironman.back.dto;

import com.Ironman.back.entity.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
	private String email;
	private String pw;
	private String name;
	private String gender;
	private String birthdate;

	public UserEntity toEntity() {
		return UserEntity.builder()
				.email(this.email)
				.pw(this.pw)
				.name(this.name)
				.gender(this.gender)
				.birthdate(this.birthdate)
				.build();
	}
	
	public static UserDto from(UserEntity entity) {
		return UserDto.builder()
				.email(entity.getEmail())
				.name(entity.getName())
				.gender(entity.getGender())
				.birthdate(entity.getBirthdate())
				.pw(null) // 보안상 패스워드는 제외하거나 null 처리
				.build();
	}
	
}
