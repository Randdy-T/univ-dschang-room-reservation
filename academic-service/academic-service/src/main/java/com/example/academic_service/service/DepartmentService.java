package com.example.academic_service.service;


import com.example.academic_service.dto.request.DepartmentRequestDTO;
import com.example.academic_service.model.*;
import com.example.academic_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;

    /*
     * Création d'un département
     */
    public Department createDepartment(DepartmentRequestDTO dto) {

        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() ->
                        new RuntimeException("Faculty not found"));

        Department department = Department.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .faculty(faculty)
                .build();

        return departmentRepository.save(department);
    }

    /*
     * Retourne tous les départements
     */
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    /*
     * Retourne les départements d'une faculté
     */
    public List<Department> getDepartmentsByFaculty(Long facultyId) {

        return departmentRepository.findByFacultyId(facultyId);
    }

    /*
     * Retourne un département par ID
     */
    public Department getDepartmentById(Long id) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));
    }

    /*
     * Suppression d'un département
     */
    public void deleteDepartment(Long id) {

        Department department = getDepartmentById(id);

        departmentRepository.delete(department);
    }
}