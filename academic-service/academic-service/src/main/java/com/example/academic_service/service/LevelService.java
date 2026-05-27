package com.example.academic_service.service;

import com.example.academic_service.model.*;
import com.example.academic_service.repository.*;
import com.example.academic_service.dto.request.LevelRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.Builder;

import java.util.List;

@Builder
@Service
@RequiredArgsConstructor
public class LevelService {

    private final LevelRepository levelRepository;
    private final ProgramRepository programRepository;

    /*
     * Création d'un niveau académique
     */
    public Level createLevel(LevelRequestDTO dto) {

        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() ->
                        new RuntimeException("Program not found"));

        Level level = Level.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .capacity(dto.getCapacity())
                .program(program)
                .build();

        return levelRepository.save(level);
    }

    /*
     * Retourne tous les niveaux
     */
    public List<Level> getAllLevels() {

        return levelRepository.findAll();
    }

    /*
     * Retourne un niveau par son ID
     */
    public Level getLevelById(Long id) {

        return levelRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Level not found"));
    }

    /*
     * Retourne les niveaux d'un programme
     */
    public List<Level> getLevelsByProgram(Long programId) {

        return levelRepository.findByProgramId(programId);
    }

    /*
     * Met à jour un niveau
     */
    public Level updateLevel(Long id, LevelRequestDTO dto) {

        Level level = getLevelById(id);

        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() ->
                        new RuntimeException("Program not found"));

        level.setCode(dto.getCode());
        level.setName(dto.getName());
        level.setDescription(dto.getDescription());
        level.setCapacity(dto.getCapacity());
        level.setProgram(program);

        return levelRepository.save(level);
    }

    /*
     * Supprime un niveau
     */
    public void deleteLevel(Long id) {

        Level level = getLevelById(id);

        levelRepository.delete(level);
    }
}
