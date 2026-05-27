package com.example.academic_service.dto.request;

import lombok.Data;

@Data
public class LevelRequestDTO {

    private String code;

    private String name;

    private String description;

    private int capacity;

    private Long programId;
}
