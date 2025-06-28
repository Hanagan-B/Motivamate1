package com.motivamate.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.motivamate.backend.model.BotCompanion;

public interface BotCompanionRepository extends JpaRepository<BotCompanion, Long> {
}
