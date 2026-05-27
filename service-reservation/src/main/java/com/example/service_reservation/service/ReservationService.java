package com.example.service_reservation.service;

import com.example.service_reservation.dto.CreateReservationRequest;
import com.example.service_reservation.entity.Reservation;
import java.util.List;

public interface ReservationService {
    Reservation createReservation(
            CreateReservationRequest request
    );
List<Reservation> getAllReservations();

Reservation getReservationById(Long id);

Reservation confirmReservation(Long id);

Reservation cancelReservation(Long id);

void deleteReservation(Long id);
}
