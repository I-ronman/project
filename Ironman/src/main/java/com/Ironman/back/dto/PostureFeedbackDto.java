package com.Ironman.back.dto;

import com.Ironman.back.entity.PostureFeedbackEntity;
import com.Ironman.back.entity.SingleExerciseLogEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostureFeedbackDto {

    private Long singleExerciseLogId;
    private String detectedIssue;
    private String feedbackImg;          // base64 전체 문자열 (data:image/... 포함)
    private String postureFeedbackcol;

    public PostureFeedbackEntity toEntity(SingleExerciseLogEntity log) {
        String base64Data = feedbackImg;

        // ⚠️ 필요시 앞부분 제거
        if (feedbackImg != null && feedbackImg.startsWith("data:")) {
            base64Data = feedbackImg.substring(feedbackImg.indexOf(",") + 1);
        }

        return PostureFeedbackEntity.builder()
                .singleExerciseLog(log)
                .detectedIssue(detectedIssue)
                .feedbackImg(base64Data)
                .postureFeedbackcol(postureFeedbackcol)
                .build();
    }
}
