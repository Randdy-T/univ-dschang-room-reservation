package com.example.academic_service.controller;

import com.example.academic_service.dto.request.*;
import com.example.academic_service.model.*;
import com.example.academic_service.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import lombok.*;
import java.util.List;

@Builder
@RestController
@RequestMapping("/api/academic")
@RequiredArgsConstructor
public class AcademicController {

    private final FacultyService facultyService;
    private final DepartmentService departmentService;
    private final ProgramService programService;
    private final LevelService levelService;
    private final CourseService courseService;

    // ================= FACULTY =================

    /*
     * Création d'une faculté
     */
    @PostMapping("/faculties")
    public Faculty createFaculty(
            @RequestBody FacultyRequestDTO dto
    ) {
        return facultyService.createFaculty(dto);
    }

    /*
     * Retourne toutes les facultés
     */
    @GetMapping("/faculties")
    public List<Faculty> getAllFaculties() {
        return facultyService.getAllFaculties();
    }

    /*
     * Retourne une faculté par ID
     */
    @GetMapping("/faculties/{id}")
    public Faculty getFacultyById(
            @PathVariable Long id
    ) {
        return facultyService.getFacultyById(id);
    }

    /*
     * Suppression d'une faculté
     */
    @DeleteMapping("/faculties/{id}")
    public void deleteFaculty(
            @PathVariable Long id
    ) {
        facultyService.deleteFaculty(id);
    }

    // ================= DEPARTMENT =================

    /*
     * Création d'un département
     */
    @PostMapping("/departments")
    public Department createDepartment(
            @RequestBody DepartmentRequestDTO dto
    ) {
        return departmentService.createDepartment(dto);
    }

    /*
     * Retourne tous les départements
     */
    @GetMapping("/departments")
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    /*
     * Retourne les départements d'une faculté
     */
    @GetMapping("/faculties/{facultyId}/departments")
    public List<Department> getDepartmentsByFaculty(
            @PathVariable Long facultyId
    ) {
        return departmentService.getDepartmentsByFaculty(facultyId);
    }

    // ================= PROGRAM =================

    /*
     * Création d'un programme/filière
     */
    @PostMapping("/programs")
    public Program createProgram(
            @RequestBody ProgramRequestDTO dto
    ) {
        return programService.createProgram(dto);
    }

    /*
     * Retourne tous les programmes
     */
    @GetMapping("/programs")
    public List<Program> getAllPrograms() {
        return programService.getAllPrograms();
    }

    /*
     * Retourne les programmes d'un département
     */
    @GetMapping("/departments/{departmentId}/programs")
    public List<Program> getProgramsByDepartment(
            @PathVariable Long departmentId
    ) {
        return programService.getProgramsByDepartment(departmentId);
    }

    // ================= LEVEL =================

    /*
     * Création d'un niveau
     */
    @PostMapping("/levels")
    public Level createLevel(
            @RequestBody LevelRequestDTO dto
    ) {
        return levelService.createLevel(dto);
    }

    /*
     * Retourne tous les niveaux
     */
    @GetMapping("/levels")
    public List<Level> getAllLevels() {
        return levelService.getAllLevels();
    }

    /*
     * Retourne les niveaux d'un programme
     */
    @GetMapping("/programs/{programId}/levels")
    public List<Level> getLevelsByProgram(
            @PathVariable Long programId
    ) {
        return levelService.getLevelsByProgram(programId);
    }

    // ================= COURSE =================

    /*
     * Création d'un cours
     */
    @PostMapping("/courses")
    public Course createCourse(
            @RequestBody CourseRequestDTO dto
    ) {
        return courseService.createCourse(dto);
    }

    /*
     * Retourne les cours d'un niveau
     */
    @GetMapping("/levels/{levelId}/courses")
    public List<Course> getCoursesByLevel(
            @PathVariable Long levelId
    ) {
        return courseService.getCoursesByLevel(levelId);
    }

    /*
     * Retourne les cours d'un enseignant
     */
    @GetMapping("/teachers/{teacherId}/courses")
    public List<Course> getCoursesByTeacher(
            @PathVariable Long teacherId
    ) {
        return courseService.getCoursesByTeacher(teacherId);
    }
}