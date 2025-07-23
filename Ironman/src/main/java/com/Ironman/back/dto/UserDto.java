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
}
