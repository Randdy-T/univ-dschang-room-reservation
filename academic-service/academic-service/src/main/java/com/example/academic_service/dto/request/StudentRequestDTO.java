package com.example.academic_service.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentRequestDTO {

    private Long userId;

    private LocalDate dateNaissance;

    private String lieuNaissance;

    private String adresse;

    private int anneeEntree;

    private String parentPhone;

    private Long levelId;

    private Long programId;
}