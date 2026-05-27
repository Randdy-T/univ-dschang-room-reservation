package com.example.academic_service.dto.request;

import lombok.Data;

@Data
public class DepartmentRequestDTO {

    private String code;

    private String name;

    private String description;

    private Long facultyId;
}
