package com.Ironman.back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userInfoId;
	private Float height;
	private Float weight;
	
	private String activity;
	private String pushupLevel;
	private String plankTime;
	private String squatLevel;
	private String flexibility;
	
	private String email;
}
