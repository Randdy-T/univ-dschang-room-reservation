package com.example.academic_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseResponseDTO {

    private Long id;

    private String code;

    private String title;

    private String description;

    private int credits;

    private int volumeHoraire;

    private int semestre;

    private String anneeAcademique;

    private Long teacherId;

    private String teacherName;

    private Long levelId;

    private String levelName;
}
