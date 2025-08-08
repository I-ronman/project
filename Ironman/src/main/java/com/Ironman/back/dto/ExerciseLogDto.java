package com.Ironman.back.dto;

import java.util.List;

import lombok.Data;

@Data
public class ExerciseLogDto {
    private String email;
    private List<ExerciseEntity> exerciseLogs;

    @Data
    public static class ExerciseEntity {
        private Long exerciseId;
        private Integer duration;
        private Double endTime;
        private Integer goodCount;
        private Integer badCount;
    }
}

