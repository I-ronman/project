package com.Ironman.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "routine_exercise")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineExerciseEntity {

		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long routineExerciseId;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "routine_id", nullable = false)
	    private RoutineEntity routine;  // 연관관계 매핑
	    
	    @Column(name = "exercise_id", nullable = true)
	    private Long exerciseId;
	    
	    @Column(nullable = true)
	    private Integer sets;
	    @Column(nullable = true)
	    private Integer reps;
	    @Column(nullable = true)
	    private Integer exerciseTime;

	    @Column(name = "`order`") // 예약어 처리
	    private Integer order;
}
