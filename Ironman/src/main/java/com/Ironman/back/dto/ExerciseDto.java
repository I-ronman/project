package com.Ironman.back.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseDto {
    private String exerciseId;
    private Integer sets;
    private Integer reps;
    private Integer exerciseTime;
    private Integer order;
}