package com.example.academic_service.service;

import com.example.academic_service.model.*;
import com.example.academic_service.repository.*;
import com.example.academic_service.dto.request.CourseRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.Builder;

import java.util.List;

@Builder
@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final LevelRepository levelRepository;

    /*
     * Création d'un cours
     */
    public Course createCourse(CourseRequestDTO dto) {

        Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        Level level = levelRepository.findById(dto.getLevelId())
                .orElseThrow(() ->
                        new RuntimeException("Level not found"));

        Course course = Course.builder()
                .code(dto.getCode())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .credits(dto.getCredits())
                .volumeHoraire(dto.getVolumeHoraire())
                .semestre(dto.getSemestre())
                .anneeAcademique(dto.getAnneeAcademique())
                .teacher(teacher)
                .level(level)
                .build();

        return courseRepository.save(course);
    }

    /*
     * Retourne les cours d'un enseignant
     */
    public List<Course> getCoursesByTeacher(Long teacherId) {

        return courseRepository.findByTeacherId(teacherId);
    }

    /*
     * Retourne les cours d'un niveau
     */
    public List<Course> getCoursesByLevel(Long levelId) {

        return courseRepository.findByLevelId(levelId);
    }
}