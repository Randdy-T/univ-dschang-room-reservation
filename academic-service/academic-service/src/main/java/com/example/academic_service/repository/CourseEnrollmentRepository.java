package com.example.academic_service.repository;

import com.example.academic_service.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {

    List<CourseEnrollment> findByStudentId(Long studentId);

    List<CourseEnrollment> findByCourseId(Long courseId);

    List<CourseEnrollment> findByStatus(EnrollmentStatus status);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}
