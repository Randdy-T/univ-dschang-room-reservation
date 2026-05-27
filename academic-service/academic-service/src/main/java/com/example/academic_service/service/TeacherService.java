package com.example.academic_service.service;

import com.example.academic_service.dto.request.TeacherRequestDTO;
import com.example.academic_service.model.*;
import com.example.academic_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Optimise les lectures par défaut
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;

    /**
     * Création d'un enseignant
     */
    @Transactional
    public Teacher createTeacher(TeacherRequestDTO dto) {
        // Vérification du département
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Département introuvable avec l'ID : " + dto.getDepartmentId()));

        // Construction de l'enseignant (Note : mandatAnnee correspond à votre entité)
        Teacher teacher = Teacher.builder()
                .userId(dto.getUserId())
                .grade(dto.getGrade()) // Assurez-vous que le DTO envoie bien le type Grade
                .specialite(dto.getSpecialite())
                .isHeadOfDepartment(dto.isHeadOfDepartment())
                .dateNomination(dto.getDateNomination())
                .mandatAnnee(dto.getMandatAnnee()) 
                .department(department)
                .build();

        return teacherRepository.save(teacher);
    }

    /**
     * Retourne tous les enseignants
     */
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    /**
     * Retourne un enseignant par ID
     */
    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable avec l'ID : " + id));
    }

    /**
     * Retourne les enseignants d'un département
     */
    public List<Teacher> getTeachersByDepartment(Long departmentId) {
        return teacherRepository.findByDepartmentId(departmentId);
    }

    /**
     * Retourne les enseignants selon leur grade (Optimisé via Repository)
     */
    public List<Teacher> getTeachersByGrade(Grade grade) {
        // On laisse la base de données filtrer au lieu de tout charger en mémoire
        return teacherRepository.findByGrade(grade);
    }

    /**
     * Met à jour un enseignant
     */
    @Transactional
    public Teacher updateTeacher(Long id, TeacherRequestDTO dto) {
        Teacher teacher = getTeacherById(id);

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Département introuvable pour la mise à jour"));

        // Mise à jour des champs
        teacher.setUserId(dto.getUserId());
        teacher.setGrade(dto.getGrade());
        teacher.setSpecialite(dto.getSpecialite());
        teacher.setHeadOfDepartment(dto.isHeadOfDepartment());
        teacher.setDateNomination(dto.getDateNomination());
        teacher.setMandatAnnee(dto.getMandatAnnee()); // Correspond à l'entité
        teacher.setDepartment(department);

        return teacherRepository.save(teacher);
    }

    /**
     * Suppression d'un enseignant
     */
    @Transactional
    public void deleteTeacher(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Enseignant introuvable");
        }
        teacherRepository.deleteById(id);
    }
}