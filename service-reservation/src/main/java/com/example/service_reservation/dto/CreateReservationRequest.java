package com.example.service_reservation.dto;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotNull;

import com.example.service_reservation.entity.ReservationType;

public record CreateReservationRequest(
    @NotNull(message = "roomId est obligatoire")
        Long roomId,

        @NotNull(message = "reservedByUserId est obligatoire")
        Long reservedByUserId,

        @NotNull(message = "levelId est obligatoire")
        Long levelId,

        @NotNull(message = "reservationType est obligatoire")
        ReservationType reservationType,

        @NotNull(message = "startDateTime est obligatoire")
        LocalDateTime startDateTime,

        @NotNull(message = "endDateTime est obligatoire")
        LocalDateTime endDateTime
) {
    
}
