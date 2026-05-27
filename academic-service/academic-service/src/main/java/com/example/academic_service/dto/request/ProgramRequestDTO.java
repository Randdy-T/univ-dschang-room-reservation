package com.example.academic_service.dto.request;

import lombok.Data;

@Data
public class ProgramRequestDTO {

    private String code;

    private String name;

    private String description;

    private int dureeCycles;

    private Long departmentId;
}
