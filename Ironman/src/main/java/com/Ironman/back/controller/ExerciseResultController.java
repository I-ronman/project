package com.Ironman.back.controller;

import com.Ironman.back.dto.ExerciseLogDto;
import com.Ironman.back.service.ExerciseResultService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ExerciseResultController {

    private final ExerciseResultService exerciseResultService;

    @PostMapping("/api/exercise/result")
    public ResponseEntity<?> saveExerciseResult(@RequestBody ExerciseLogDto dto) {
        exerciseResultService.saveLogs(dto);
        return ResponseEntity.ok("운동 결과 저장 완료");
    }
}
