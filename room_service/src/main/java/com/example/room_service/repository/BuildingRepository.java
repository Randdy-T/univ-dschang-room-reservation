package com.example.room_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.room_service.entity.Building;

public interface BuildingRepository extends JpaRepository<Building, Long> {
    
}
