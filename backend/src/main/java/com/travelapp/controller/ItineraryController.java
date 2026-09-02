package com.travelapp.controller;

import com.travelapp.dto.ItineraryRequestDTO;
import com.travelapp.dto.ItineraryResponseDTO;
import com.travelapp.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/itinerary")
public class ItineraryController {

    private final ChatService chatService;

    public ItineraryController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ItineraryResponseDTO> generateItinerary(@RequestBody ItineraryRequestDTO request) {
        return ResponseEntity.ok(chatService.generateItinerary(request));
    }
}
