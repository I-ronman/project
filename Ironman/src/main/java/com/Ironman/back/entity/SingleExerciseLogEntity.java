package com.Ironman.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "single_exercise_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SingleExerciseLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "single_exercise_log_id")
    private Long singleExerciseLogId;

    @Column(name = "exercise_id", nullable = false)
    private Long exerciseId;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "end_time")
    private Double endTime;

    @Column(name = "good_count")
    private Integer goodCount;

    @Column(name = "bad_count")
    private Integer badCount;
}
