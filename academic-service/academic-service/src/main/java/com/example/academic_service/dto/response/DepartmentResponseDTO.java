package com.example.academic_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentResponseDTO {

    private Long id;

    private String code;

    private String name;

    private String description;

    private Long facultyId;

    private String facultyName;
}
