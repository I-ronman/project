package com.Ironman.back.dto;

import lombok.Data;

@Data
public class SurveyDto {
    private Float height;
    private Float weight;
    private String activityLevel;
    private String pushUp;
    private String plank;
    private String squat;
    private String pliability;
    private String goalWeight;
    private String workoutFrequency;
}

