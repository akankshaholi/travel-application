package com.travelapp.controller;

import com.travelapp.dto.DestinationDTO;
import com.travelapp.dto.DestinationDetailDTO;
import com.travelapp.service.DestinationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    public ResponseEntity<List<DestinationDTO>> getAllDestinations() {
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinationDetailDTO> getDestinationById(@PathVariable Long id) {
        return ResponseEntity.ok(destinationService.getDestinationById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DestinationDTO>> searchDestinations(@RequestParam String query) {
        return ResponseEntity.ok(destinationService.searchDestinations(query));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<DestinationDTO>> filterDestinations(
            @RequestParam(required = false) String continent,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(destinationService.filterDestinations(continent, category));
    }
}
