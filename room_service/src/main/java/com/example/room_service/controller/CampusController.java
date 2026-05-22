package com.example.room_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.room_service.entity.Campus;
import com.example.room_service.repository.CampusRepository;

@RestController
@RequestMapping("/campuses")
public class CampusController {
    @Autowired
    private CampusRepository campusRepository;

    @PostMapping
    public Campus create(@RequestBody Campus campus) {
        return campusRepository.save(campus);
    }

    @GetMapping
    public List<Campus> getAll() {
        return campusRepository.findAll();
    }

    @GetMapping("/{id}")
    public Campus getById(@PathVariable Long id) {
        return campusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campus not found"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        campusRepository.deleteById(id);
    }
}
