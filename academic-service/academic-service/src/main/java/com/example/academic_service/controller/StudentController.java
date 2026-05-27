package com.example.academic_service.controller;

import com.example.academic_service.dto.request.*;
import com.example.academic_service.model.*;
import com.example.academic_service.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final StudentImportJobService importJobService;

    /*
     * Création d'un étudiant
     */
    @PostMapping
    public Student createStudent(
            @RequestBody StudentRequestDTO dto
    ) {
        return studentService.createStudent(dto);
    }

    /*
     * Retourne tous les étudiants
     */
    @GetMapping
    public List<Student> getAllStudents() {

        return studentService.getAllStudents();
    }

    /*
     * Retourne les étudiants d'un niveau
     */
    @GetMapping("/level/{levelId}")
    public List<Student> getStudentsByLevel(
            @PathVariable Long levelId
    ) {
        return studentService.getStudentsByLevel(levelId);
    }

    /*
     * Retourne les étudiants d'un programme
     */
    @GetMapping("/program/{programId}")
    public List<Student> getStudentsByProgram(
            @PathVariable Long programId
    ) {
        return studentService.getStudentsByProgram(programId);
    }

    /*
     * Retourne l'historique des imports
     */
    @GetMapping("/imports")
    public List<StudentImportJob> getImports() {

        return importJobService.getAllImports();
    }
}