package com.example.service_reservation.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.service_reservation.dto.CreateReservationRequest;
import com.example.service_reservation.entity.Reservation;
import com.example.service_reservation.entity.ReservationStatus;
import com.example.service_reservation.entity.TimeSlot;
import com.example.service_reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {
        private final ReservationRepository reservationRepository;

        @Override
        public Reservation createReservation(
                        CreateReservationRequest request) {

                if (request.endDateTime().isBefore(request.startDateTime())) {
                        throw new IllegalArgumentException(
                                        "La date de fin doit être après la date de début");
                }
                boolean conflict = reservationRepository.existsConflict(
                                request.roomId(),
                                request.startDateTime(),
                                request.endDateTime());

                if (conflict) {
                        throw new IllegalStateException(
                                        "Cette salle est déjà réservée sur ce créneau.");
                }

                Reservation reservation = Reservation.builder()
                                .roomId(request.roomId())
                                .reservedByUserId(request.reservedByUserId())
                                .levelId(request.levelId())
                                .reservationType(request.reservationType())
                                .status(ReservationStatus.PENDING)
                                .timeSlot(
                                                new TimeSlot(
                                                                request.startDateTime(),
                                                                request.endDateTime()))
                                .createdAt(LocalDateTime.now())
                                .expiresAt(LocalDateTime.now().plusMinutes(15))
                                .build();

                return reservationRepository.save(reservation);
        }

        @Override
        public List<Reservation> getAllReservations() {
                return reservationRepository.findAll();
        }

        @Override
        public Reservation getReservationById(Long id) {
                return reservationRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Réservation introuvable"));
        }

        @Override
        public Reservation confirmReservation(Long id) {

                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Réservation introuvable"));

                reservation.setStatus(ReservationStatus.CONFIRMED);

                return reservationRepository.save(reservation);
        }

        @Override
        public Reservation cancelReservation(Long id) {

                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Réservation introuvable"));

                reservation.setStatus(ReservationStatus.CANCELLED);

                return reservationRepository.save(reservation);
        }

        @Override
        public void deleteReservation(Long id) {
                reservationRepository.deleteById(id);
        }
}
