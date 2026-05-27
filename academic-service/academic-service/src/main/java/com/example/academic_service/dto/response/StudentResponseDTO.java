package com.example.academic_service.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class StudentResponseDTO {

    private Long id;

    private Long userId;

    private LocalDate dateNaissance;

    private String lieuNaissance;

    private String adresse;

    private int anneeEntree;

    private String parentPhone;

    private Long levelId;

    private String levelName;

    private Long programId;

    private String programName;
}
