package com.Ironman.back.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Ironman.back.entity.PostureFeedbackEntity;

public interface PostureFeedbackRepository extends JpaRepository<PostureFeedbackEntity, Long> {
}

