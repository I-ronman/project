package com.Ironman.back.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.Ironman.back.dto.RoutineExerciseDto;
import com.Ironman.back.dto.FullRoutineDto;
import com.Ironman.back.entity.RoutineEntity;
import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.RoutineRepository;
import com.Ironman.back.service.RoutineService;

import jakarta.mail.Session;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpSession;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/routine")
public class RoutineController {

    private final RoutineService routineService;
    private final RoutineRepository routineRepository;

    @RequestMapping(value = "/save", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> saveOrUpdateRoutine(@RequestBody FullRoutineDto dto, HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }

        if (dto.getRoutineId() == null) {
            System.out.println("🆕 루틴 신규 저장 요청");
        } else {
            System.out.println("✏️ 루틴 수정 요청 - routineId: " + dto.getRoutineId());
        }

        routineService.saveOrUpdateFullRoutine(dto, user.getEmail());
        return ResponseEntity.ok("루틴 저장/수정 완료");
    }


    // 내 루틴 목록 조회
    @GetMapping("/list")
    public ResponseEntity<?> getMyRoutines(HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }

        String email = user.getEmail();
        List<FullRoutineDto> routines = routineService.getRoutinesByUser(email);
        return ResponseEntity.ok(routines);
    }
    
    @DeleteMapping("/{routineId}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Long routineId, HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        routineService.deleteRoutine(routineId, user.getEmail());
        return ResponseEntity.ok().build();
    }
    
}
