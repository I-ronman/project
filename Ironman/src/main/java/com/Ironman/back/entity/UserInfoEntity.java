                                         package com.Ironman.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_info")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class UserInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userInfoId;

    @Column(nullable = false, unique = true)
    private String email;

    private float height;
    private float weight;
    
    @Column(name = "activity_level")
    private String activityLevel;
    private String pushUp;
    private String plank;
    private String squat;
    private String pliability;
    
    @Column(name = "goal_weight")
    private String goalWeight;
    private String workoutFrequency;
}
