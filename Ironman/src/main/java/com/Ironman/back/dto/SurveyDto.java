package com.Ironman.back.dto;

import lombok.Data;

@Data
public class SurveyDto {
    private float height;
    private float weight;
    private String activityLevel;
    private String pushUp;
    private String plank;
    private String squat;
    private String pliability;
}

