package com.example.academic_service.repository;

import com.example.academic_service.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentImportJobRepository extends JpaRepository<StudentImportJob, Long> {

}