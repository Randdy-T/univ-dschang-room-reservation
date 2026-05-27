package com.example.academic_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProgramResponseDTO {

    private Long id;

    private String code;

    private String name;

    private String description;

    private int dureeCycles;

    private Long departmentId;

    private String departmentName;
}