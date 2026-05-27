package com.example.academic_service.service;


import com.example.academic_service.dto.request.*;
import com.example.academic_service.model.*;
import com.example.academic_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.Builder;
import java.util.List;

@Builder
@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final LevelRepository levelRepository;
    private final ProgramRepository programRepository;

    /*
     * Création d'un étudiant
     */
    public Student createStudent(StudentRequestDTO dto) {

        Level level = levelRepository.findById(dto.getLevelId())
                .orElseThrow(() ->
                        new RuntimeException("Level not found"));

        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() ->
                        new RuntimeException("Program not found"));

        Student student = Student.builder()
                .userId(dto.getUserId())
                .dateNaissance(dto.getDateNaissance())
                .lieuNaissance(dto.getLieuNaissance())
                .adresse(dto.getAdresse())
                .anneeEntree(dto.getAnneeEntree())
                .parentPhone(dto.getParentPhone())
                .level(level)
                .program(program)
                .build();

        return studentRepository.save(student);
    }

    /*
     * Retourne tous les étudiants
     */
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /*
     * Retourne les étudiants d'un niveau
     */
    public List<Student> getStudentsByLevel(Long levelId) {

        return studentRepository.findByLevelId(levelId);
    }

    /*
     * Retourne les étudiants d'un programme
     */
    public List<Student> getStudentsByProgram(Long programId) {

        return studentRepository.findByProgramId(programId);
    }
}