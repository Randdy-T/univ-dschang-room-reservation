package com.example.room_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.room_service.entity.Building;
import com.example.room_service.entity.Campus;
import com.example.room_service.repository.BuildingRepository;
import com.example.room_service.repository.CampusRepository;

@RestController
@RequestMapping("/buildings")
public class BuildingController {
     @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private CampusRepository campusRepository;

    @PostMapping("/{campusId}")
    public Building create(@PathVariable Long campusId, @RequestBody Building building) {

        Campus campus = campusRepository.findById(campusId)
                .orElseThrow(() -> new RuntimeException("Campus not found"));

        building.setCampus(campus);

        return buildingRepository.save(building);
    }

    @GetMapping
    public List<Building> getAll() {
        return buildingRepository.findAll();
    }

    @GetMapping("/{id}")
    public Building getById(@PathVariable Long id) {
        return buildingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Building not found"));
    }
}
