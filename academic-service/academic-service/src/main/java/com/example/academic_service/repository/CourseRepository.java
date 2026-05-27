package com.example.academic_service.repository;

import com.example.academic_service.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByCode(String code);

    boolean existsByCode(String code);

    List<Course> findByTeacherId(Long teacherId);

    List<Course> findByLevelId(Long levelId);

    List<Course> findBySemestre(int semestre);

    List<Course> findByAnneeAcademique(String anneeAcademique);
}
