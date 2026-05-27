package com.example.academic_service.service;


import com.example.academic_service.dto.request.ProgramRequestDTO;
import com.example.academic_service.model.*;
import com.example.academic_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.Builder;
import java.util.List;

@Builder
@Service
@RequiredArgsConstructor
public class ProgramService {

    private final ProgramRepository programRepository;
    private final DepartmentRepository departmentRepository;

    /*
     * Création d'un programme/filière
     */
    public Program createProgram(ProgramRequestDTO dto) {

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));

        Program program = Program.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .dureeCycles(dto.getDureeCycles())
                .department(department)
                .build();

        return programRepository.save(program);
    }

    /*
     * Retourne tous les programmes
     */
    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    /*
     * Retourne les programmes d'un département
     */
    public List<Program> getProgramsByDepartment(Long departmentId) {

        return programRepository.findByDepartmentId(departmentId);
    }
}
