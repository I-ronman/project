package com.Ironman.back.dto;

import com.Ironman.back.entity.UserInfoEntity;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoDto {
	private Float height;
    private Float weight;
    private String activity;
    private String pushupLevel;
    private String plankTime;
    private String squatLevel;
    private String flexibility;
    
    public UserInfoEntity toEntity(String email) {
    	return UserInfoEntity.builder()
    			.height(height)
    			.weight(weight)
    			.activity(activity)
    			.pushupLevel(pushupLevel)
    			.plankTime(plankTime)
    			.squatLevel(squatLevel)
    			.flexibility(flexibility)
    			.email(email)
    			.build();
    }
}
