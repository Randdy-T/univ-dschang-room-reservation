package com.example.service_reservation.controller;

import com.example.service_reservation.dto.CreateReservationRequest;
import com.example.service_reservation.entity.Reservation;
import com.example.service_reservation.service.ReservationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public Reservation createReservation(
            @RequestBody @Valid CreateReservationRequest request) {

        return reservationService.createReservation(request);
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public Reservation getReservationById(
            @PathVariable Long id) {

        return reservationService.getReservationById(id);
    }

    @PutMapping("/{id}/confirm")
    public Reservation confirmReservation(
            @PathVariable Long id) {

        return reservationService.confirmReservation(id);
    }

    @PutMapping("/{id}/cancel")
    public Reservation cancelReservation(
            @PathVariable Long id) {

        return reservationService.cancelReservation(id);
    }
    @DeleteMapping("/{id}/Annuler")
    public void deleteReservation(
            @PathVariable Long id) {

        reservationService.deleteReservation(id);
    }
}