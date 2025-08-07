package com.Ironman.back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercise")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_id")
    private Long exerciseId;

    @Column(name = "exercise_name", nullable = false)
    private String exerciseName;

    @Column(name = "expected_calorie", nullable = true)
    private Integer expectedCalorie;
    
    @Column(name = "exercise_summary", nullable = true)
    private String exerciseSummary;
    
    @Column(name = "exercise_img", nullable = true)
    private String exerciseImg;
    
    @Column(name = "part", nullable = true)
    private String part;
}
