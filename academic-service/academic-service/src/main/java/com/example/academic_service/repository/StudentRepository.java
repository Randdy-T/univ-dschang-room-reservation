package com.example.academic_service.repository;

import com.example.academic_service.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByLevelId(Long levelId);

    List<Student> findByProgramId(Long programId);

    List<Student> findByAnneeEntree(int anneeEntree);

    boolean existsByUserId(Long userId);
}
