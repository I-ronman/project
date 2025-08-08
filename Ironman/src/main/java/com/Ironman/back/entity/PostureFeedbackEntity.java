package com.Ironman.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "posture_feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostureFeedbackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedbackId;
    
    @ManyToOne
    @JoinColumn(name = "single_exercise_log_id", nullable = false)
    private SingleExerciseLogEntity singleExerciseLog;

    @Column(name = "detected_issue")
    private String detectedIssue;

    @Lob
    @Column(name = "feedback_img", columnDefinition = "LONGTEXT")
    private String feedbackImg;  // base64 이미지

    @Column(name = "posture_feedbackcol")
    private String postureFeedbackcol;
}


