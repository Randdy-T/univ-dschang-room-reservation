package com.example.academic_service.dto.request;

import com.example.academic_service.model.EnrollmentStatus;
import lombok.Data;

@Data
public class CourseEnrollmentRequestDTO {

    private Long studentId;

    private Long courseId;

    private EnrollmentStatus status;
}
