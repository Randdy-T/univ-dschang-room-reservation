package com.example.academic_service.repository;

import com.example.academic_service.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface LevelRepository extends JpaRepository<Level, Long> {

    Optional<Level> findByCode(String code);

    boolean existsByCode(String code);

    List<Level> findByProgramId(Long programId);
}
