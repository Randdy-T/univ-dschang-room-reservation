package com.example.academic_service.service;

import com.example.academic_service.dto.request.FacultyRequestDTO;
import com.example.academic_service.model.Faculty;
import com.example.academic_service.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Optimise les performances pour les méthodes de lecture
public class FacultyService {

    private final FacultyRepository facultyRepository;

    /**
     * Crée une nouvelle faculté après avoir vérifié que le code est unique.
     */
    @Transactional
    public Faculty createFaculty(FacultyRequestDTO dto) {
        if (facultyRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Une faculté avec le code " + dto.getCode() + " existe déjà.");
        }

        Faculty faculty = Faculty.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .telephone(dto.getTelephone())
                .email(dto.getEmail())
                .deanId(dto.getDeanId())
                .build();

        return facultyRepository.save(faculty);
    }

    /**
     * Retourne la liste de toutes les facultés.
     */
    public List<Faculty> getAllFaculties() {
        return facultyRepository.findAll();
    }

    /**
     * Récupère une faculté par son identifiant unique.
     */
    public Faculty getFacultyById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculté introuvable avec l'ID : " + id));
    }

    /**
     * Met à jour les informations d'une faculté existante.
     */
    @Transactional
    public Faculty updateFaculty(Long id, FacultyRequestDTO dto) {
        Faculty faculty = getFacultyById(id);

        // Vérification si le code change et s'il est déjà pris
        if (!faculty.getCode().equals(dto.getCode()) && facultyRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Le nouveau code " + dto.getCode() + " est déjà utilisé par une autre faculté.");
        }

        faculty.setCode(dto.getCode());
        faculty.setName(dto.getName());
        faculty.setTelephone(dto.getTelephone());
        faculty.setEmail(dto.getEmail());
        faculty.setDeanId(dto.getDeanId());

        return facultyRepository.save(faculty);
    }

    /**
     * Supprime une faculté de la base de données.
     */
    @Transactional
    public void deleteFaculty(Long id) {
        if (!facultyRepository.existsById(id)) {
            throw new RuntimeException("Impossible de supprimer : Faculté introuvable avec l'ID : " + id);
        }
        facultyRepository.deleteById(id);
    }
}