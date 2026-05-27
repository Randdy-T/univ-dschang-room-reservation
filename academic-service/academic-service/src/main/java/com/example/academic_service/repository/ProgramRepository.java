package com.example.academic_service.repository;

import com.example.academic_service.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProgramRepository extends JpaRepository<Program, Long> {

    Optional<Program> findByCode(String code);

    boolean existsByCode(String code);

    List<Program> findByDepartmentId(Long departmentId);
}
