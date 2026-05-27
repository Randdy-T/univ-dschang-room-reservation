package com.example.academic_service.service;

import com.example.academic_service.model.*;
import com.example.academic_service.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentImportJobService {

    private final StudentImportJobRepository importJobRepository;

    /*
     * Création d'un historique d'import
     */
    public StudentImportJob createImportJob(
            String fileName,
            int total,
            int success,
            int failed,
            String status
    ) {

        StudentImportJob job = StudentImportJob.builder()
                .fileName(fileName)
                .importDate(LocalDateTime.now())
                .totalRecords(total)
                .successCount(success)
                .failureCount(failed)
                .status(status)
                .build();

        return importJobRepository.save(job);
    }

    /*
     * Retourne l'historique des imports
     */
    public List<StudentImportJob> getAllImports() {

        return importJobRepository.findAll();
    }

    /*
     * Retourne un import spécifique
     */
    public StudentImportJob getImportById(Long id) {

        return importJobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Import job not found"));
    }

    /*
     * Supprime un historique d'import
     */
    public void deleteImport(Long id) {

        StudentImportJob job = getImportById(id);

        importJobRepository.delete(job);
    }
}
