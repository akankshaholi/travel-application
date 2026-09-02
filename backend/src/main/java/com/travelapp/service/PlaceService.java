package com.travelapp.service;

import com.travelapp.dto.PlaceDTO;
import com.travelapp.entity.Place;
import com.travelapp.exception.ResourceNotFoundException;
import com.travelapp.repository.DestinationRepository;
import com.travelapp.repository.PlaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final DestinationRepository destinationRepository;

    public PlaceService(PlaceRepository placeRepository, DestinationRepository destinationRepository) {
        this.placeRepository = placeRepository;
        this.destinationRepository = destinationRepository;
    }

    public List<PlaceDTO> getPlacesByDestinationId(Long destinationId) {
        if (!destinationRepository.existsById(destinationId)) {
            throw new ResourceNotFoundException("Destination not found");
        }
        return placeRepository.findByDestinationId(destinationId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PlaceDTO getPlaceById(Long id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Place not found"));
        return mapToDTO(place);
    }

    private PlaceDTO mapToDTO(Place place) {
        PlaceDTO dto = new PlaceDTO();
        dto.setId(place.getId());
        dto.setName(place.getName());
        dto.setDescription(place.getDescription());
        dto.setLocation(place.getLocation());
        dto.setCategory(place.getCategory());
        dto.setRecommendedDuration(place.getRecommendedDuration());
        dto.setLatitude(place.getLatitude());
        dto.setLongitude(place.getLongitude());
        return dto;
    }
}
