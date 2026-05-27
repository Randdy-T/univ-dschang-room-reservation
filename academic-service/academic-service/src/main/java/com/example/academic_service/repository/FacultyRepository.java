package com.example.academic_service.repository;

import com.example.academic_service.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FacultyRepository extends JpaRepository <Faculty, Long> {

    Optional<Faculty> findByCode(String code);

    boolean existsByCode(String code);
}
