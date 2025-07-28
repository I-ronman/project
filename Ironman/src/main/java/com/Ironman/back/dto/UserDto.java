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
	private String brithdate;

	public UserEntity toEntity() {
		return UserEntity.builder()
				.email(this.email)
				.pw(this.pw)
				.name(this.name)
				.gender(this.gender)
				.birthDate(this.brithdate)
				.build();
	}
	
	public static UserDto from(UserEntity entity) {
		return UserDto.builder()
				.email(entity.getEmail())
				.name(entity.getName())
				.gender(entity.getGender())
				.brithdate(entity.getBirthDate())
				.pw(null) // 보안상 패스워드는 제외하거나 null 처리
				.build();
	}
	
}
