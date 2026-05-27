package com.example.academic_service.controller;

import com.example.academic_service.dto.request.*;
import com.example.academic_service.model.*;
import com.example.academic_service.service.TeacherService; // <-- CETTE LIGNE MANQUAIT
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    /*
     * Création d'un enseignant
     */
    @PostMapping
    public Teacher createTeacher(
            @RequestBody TeacherRequestDTO dto
    ) {
        return teacherService.createTeacher(dto);
    }

    /*
     * Retourne tous les enseignants
     */
    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    /*
     * Retourne un enseignant par ID
     */
    @GetMapping("/{id}")
    public Teacher getTeacherById(
            @PathVariable Long id
    ) {
        return teacherService.getTeacherById(id);
    }

    /*
     * Retourne les enseignants d'un département
     */
    @GetMapping("/department/{departmentId}")
    public List<Teacher> getTeachersByDepartment(
            @PathVariable Long departmentId
    ) {
        return teacherService.getTeachersByDepartment(departmentId);
    }

    /*
     * Suppression d'un enseignant
     */
    @DeleteMapping("/{id}")
    public void deleteTeacher(
            @PathVariable Long id
    ) {
        teacherService.deleteTeacher(id);
    }
}