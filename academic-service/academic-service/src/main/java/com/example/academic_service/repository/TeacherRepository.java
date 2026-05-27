package com.example.academic_service.repository;

import com.example.academic_service.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    List<Teacher> findByDepartmentId(Long departmentId);

    List<Teacher> findByGrade(Grade grade);

    List<Teacher> findBySpecialiteContainingIgnoreCase(String specialite);

    boolean existsByUserId(Long userId);
}
