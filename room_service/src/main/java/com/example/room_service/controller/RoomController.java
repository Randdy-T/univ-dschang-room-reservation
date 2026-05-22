package com.example.room_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.room_service.entity.Room;
import com.example.room_service.service.RoomService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @PostMapping
    public Room create(@RequestBody Room room) {
        return roomService.createRoom(room);
    }

    @GetMapping
    public List<Room> getAll() {
        return roomService.getAllRooms();
    }

    @GetMapping("/available")
    public List<Room> getAvailable() {
        return roomService.getAvailableRooms();
    }

    @GetMapping("/capacity/{capacity}")
    public List<Room> getByCapacity(@PathVariable int capacity) {
        return roomService.getRoomsByCapacity(capacity);
    }
}
