package com.example.academic_service.dto.response;

import com.example.academic_service.model.Grade;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TeacherResponseDTO {

    private Long id;

    private Long userId;

    private Grade grade;

    private String specialite;

    private boolean isHeadOfDepartment;

    private LocalDate dateNomination;

    private int mandatAnnees;

    private Long departmentId;

    private String departmentName;
}
