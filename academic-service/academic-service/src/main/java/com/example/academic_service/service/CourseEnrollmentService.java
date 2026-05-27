package com.example.academic_service.service;

import com.example.academic_service.model.*;
import com.example.academic_service.repository.*;
import com.example.academic_service.dto.request.CourseEnrollmentRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseEnrollmentService {

    private final CourseEnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    /*
     * Inscription d'un étudiant à un cours
     */
    public CourseEnrollment enrollStudent(CourseEnrollmentRequestDTO dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        boolean alreadyExists =
                enrollmentRepository.existsByStudentIdAndCourseId(
                        dto.getStudentId(),
                        dto.getCourseId()
                );

        if (alreadyExists) {
            throw new RuntimeException("Student already enrolled");
        }

        CourseEnrollment enrollment = CourseEnrollment.builder()
                .student(student)
                .course(course)
                .status(dto.getStatus())
                .enrollmentDate(LocalDateTime.now())
                .build();

        return enrollmentRepository.save(enrollment);
    }

    /*
     * Retourne toutes les inscriptions
     */
    public List<CourseEnrollment> getAllEnrollments() {

        return enrollmentRepository.findAll();
    }

    /*
     * Retourne les cours suivis par un étudiant
     */
    public List<CourseEnrollment> getEnrollmentsByStudent(Long studentId) {

        return enrollmentRepository.findByStudentId(studentId);
    }

    /*
     * Retourne les étudiants inscrits à un cours
     */
    public List<CourseEnrollment> getEnrollmentsByCourse(Long courseId) {

        return enrollmentRepository.findByCourseId(courseId);
    }

    /*
     * Supprime une inscription pédagogique
     */
    public void deleteEnrollment(Long id) {

        CourseEnrollment enrollment =
                enrollmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Enrollment not found"));

        enrollmentRepository.delete(enrollment);
    }
}
