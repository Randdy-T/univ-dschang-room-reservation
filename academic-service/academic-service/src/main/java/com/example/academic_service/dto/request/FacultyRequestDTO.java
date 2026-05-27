package com.example.academic_service.dto.request;

// import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class FacultyRequestDTO {

    // @NotBlank(message = "code obligatoire")
    // @Size(max = 10)
    private String code;

    // @NotBlank(message = "Nom obligatoire")
    // @Size(max = 10)
    private String name;

    private String telephone;

    private String email;

    private Long deanId;
}