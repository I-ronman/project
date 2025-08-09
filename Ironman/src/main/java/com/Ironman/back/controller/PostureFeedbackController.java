package com.Ironman.back.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Ironman.back.dto.PostureFeedbackDto;
import com.Ironman.back.entity.PostureFeedbackEntity;
import com.Ironman.back.entity.SingleExerciseLogEntity;
import com.Ironman.back.repo.PostureFeedbackRepository;
import com.Ironman.back.repo.SingleExerciseLogRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posture")
public class PostureFeedbackController {

    private final PostureFeedbackRepository postureFeedbackRepository;
    private final SingleExerciseLogRepository singleExerciseLogRepository;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadPostureFeedback(@RequestBody PostureFeedbackDto dto, HttpSession session) {
        Object user = session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("세션 없음 - 로그인 필요");
        }

        try {
            // ✅ 운동 로그 먼저 조회
            SingleExerciseLogEntity log = singleExerciseLogRepository.findById(dto.getSingleExerciseLogId())
                .orElseThrow(() -> new RuntimeException("해당 운동 로그를 찾을 수 없습니다."));

            // ✅ 운동 로그 엔티티를 dto.toEntity()에 전달
            PostureFeedbackEntity entity = dto.toEntity(log);

            postureFeedbackRepository.save(entity);
            return ResponseEntity.ok("이미지 저장 성공");

        } catch (Exception e) {
            e.printStackTrace();  // 콘솔에 예외 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 저장 실패");
        }
    }

    
    @GetMapping("/list")
    public ResponseEntity<?> getPostureFeedbackList(HttpSession session) {
        Object user = session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }

        List<PostureFeedbackEntity> list = postureFeedbackRepository.findAll();  // 조건 필요 시 filter
        return ResponseEntity.ok(list);
    }

}



