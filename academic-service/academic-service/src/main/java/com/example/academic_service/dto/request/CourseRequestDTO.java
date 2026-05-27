package com.example.academic_service.dto.request;

import lombok.Data;

@Data
public class CourseRequestDTO {

    private String code;

    private String title;

    private String description;

    private int credits;

    private int volumeHoraire;

    private int semestre;

    private String anneeAcademique;

    private Long teacherId;

    private Long levelId;
}
