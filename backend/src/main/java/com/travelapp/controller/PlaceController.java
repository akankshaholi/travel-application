package com.travelapp.controller;

import com.travelapp.dto.PlaceDTO;
import com.travelapp.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PlaceController {

    private final PlaceService placeService;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @GetMapping("/destinations/{destinationId}/places")
    public ResponseEntity<List<PlaceDTO>> getPlacesByDestinationId(@PathVariable Long destinationId) {
        return ResponseEntity.ok(placeService.getPlacesByDestinationId(destinationId));
    }

    @GetMapping("/places/{id}")
    public ResponseEntity<PlaceDTO> getPlaceById(@PathVariable Long id) {
        return ResponseEntity.ok(placeService.getPlaceById(id));
    }
}
