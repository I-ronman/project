package com.Ironman.back.controller;

import com.Ironman.back.dto.ExerciseLogDto;
import com.Ironman.back.service.ExerciseResultService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ExerciseResultController {

    private final ExerciseResultService exerciseResultService;

    @PostMapping("/api/exercise/result")
    public ResponseEntity<?> saveExerciseResult(@RequestBody ExerciseLogDto dto) {
        List<Long> logIds = exerciseResultService.saveLogs(dto);

        if (logIds == null || logIds.isEmpty()) {
            return ResponseEntity.badRequest().body("로그 ID를 생성하지 못했습니다.");
        }

        return ResponseEntity.ok(logIds);
    }
}