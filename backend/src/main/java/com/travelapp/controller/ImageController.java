package com.travelapp.controller;

import com.travelapp.dto.ImageResponseDTO;
import com.travelapp.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping("/search")
    public ResponseEntity<ImageResponseDTO> searchImage(@RequestParam String query) {
        return ResponseEntity.ok(imageService.searchImage(query));
    }
}
