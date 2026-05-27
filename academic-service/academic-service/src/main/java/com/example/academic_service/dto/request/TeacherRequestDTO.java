package com.example.academic_service.dto.request;
import com.example.academic_service.model.Grade;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TeacherRequestDTO {

    private Long userId;

    private Grade grade;

    private String specialite;

    private boolean isHeadOfDepartment;

    private LocalDate dateNomination;

    private int mandatAnnee;

    private Long departmentId;
}