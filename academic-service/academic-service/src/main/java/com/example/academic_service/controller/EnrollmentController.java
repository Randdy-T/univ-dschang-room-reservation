package com.example.academic_service.controller;

import com.example.academic_service.dto.request.CourseEnrollmentRequestDTO;
import com.example.academic_service.model.*;
import com.example.academic_service.service.CourseEnrollmentService;    
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final CourseEnrollmentService enrollmentService;

    /*
     * Inscription d'un étudiant à un cours
     */
    @PostMapping
    public CourseEnrollment enrollStudent(
            @RequestBody CourseEnrollmentRequestDTO dto
    ) {
        return enrollmentService.enrollStudent(dto);
    }

    /*
     * Retourne toutes les inscriptions
     */
    @GetMapping
    public List<CourseEnrollment> getAllEnrollments() {

        return enrollmentService.getAllEnrollments();
    }

    /*
     * Retourne les cours d'un étudiant
     */
    @GetMapping("/student/{studentId}")
    public List<CourseEnrollment> getEnrollmentsByStudent(
            @PathVariable Long studentId
    ) {
        return enrollmentService.getEnrollmentsByStudent(studentId);
    }

    /*
     * Retourne les étudiants d'un cours
     */
    @GetMapping("/course/{courseId}")
    public List<CourseEnrollment> getEnrollmentsByCourse(
            @PathVariable Long courseId
    ) {
        return enrollmentService.getEnrollmentsByCourse(courseId);
    }

    /*
     * Suppression d'une inscription
     */
    @DeleteMapping("/{id}")
    public void deleteEnrollment(
            @PathVariable Long id
    ) {
        enrollmentService.deleteEnrollment(id);
    }
}