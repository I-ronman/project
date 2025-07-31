package com.Ironman.back.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FullRoutineDto {
	private Long routineId;
	private String email;
	private String title;
    private String summary;
    private Integer exerciseTime;
    private List<RoutineExerciseDto> exercises;
}
