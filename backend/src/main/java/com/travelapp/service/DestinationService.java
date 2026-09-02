package com.travelapp.service;

import com.travelapp.dto.DestinationDTO;
import com.travelapp.dto.DestinationDetailDTO;
import com.travelapp.dto.PlaceDTO;
import com.travelapp.entity.Destination;
import com.travelapp.exception.ResourceNotFoundException;
import com.travelapp.repository.DestinationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    public List<DestinationDTO> getAllDestinations() {
        return destinationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DestinationDetailDTO getDestinationById(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found"));
        return mapToDetailDTO(destination);
    }

    public List<DestinationDTO> searchDestinations(String query) {
        return destinationRepository.searchByNameOrCountry(query).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DestinationDTO> filterDestinations(String continent, String category) {
        List<Destination> destinations;
        if (continent != null && category != null) {
            destinations = destinationRepository.findByContinentIgnoreCaseAndCategoryIgnoreCase(continent, category);
        } else if (continent != null) {
            destinations = destinationRepository.findByContinentIgnoreCase(continent);
        } else if (category != null) {
            destinations = destinationRepository.findByCategoryIgnoreCase(category);
        } else {
            destinations = destinationRepository.findAll();
        }
        return destinations.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private DestinationDTO mapToDTO(Destination destination) {
        DestinationDTO dto = new DestinationDTO();
        dto.setId(destination.getId());
        dto.setName(destination.getName());
        dto.setCountry(destination.getCountry());
        dto.setContinent(destination.getContinent());
        dto.setShortDescription(destination.getShortDescription());
        dto.setCategory(destination.getCategory());
        dto.setPopularity(destination.getPopularity());
        return dto;
    }

    private DestinationDetailDTO mapToDetailDTO(Destination destination) {
        List<PlaceDTO> placeDTOs = destination.getPlaces().stream()
                .map(p -> {
                    PlaceDTO pDto = new PlaceDTO();
                    pDto.setId(p.getId());
                    pDto.setName(p.getName());
                    pDto.setDescription(p.getDescription());
                    pDto.setLocation(p.getLocation());
                    pDto.setCategory(p.getCategory());
                    pDto.setRecommendedDuration(p.getRecommendedDuration());
                    pDto.setLatitude(p.getLatitude());
                    pDto.setLongitude(p.getLongitude());
                    return pDto;
                })
                .collect(Collectors.toList());

        DestinationDetailDTO detailDTO = new DestinationDetailDTO();
        detailDTO.setId(destination.getId());
        detailDTO.setName(destination.getName());
        detailDTO.setCountry(destination.getCountry());
        detailDTO.setContinent(destination.getContinent());
        detailDTO.setShortDescription(destination.getShortDescription());
        detailDTO.setDescription(destination.getDescription());
        detailDTO.setBestTimeToVisit(destination.getBestTimeToVisit());
        detailDTO.setCategory(destination.getCategory());
        detailDTO.setLatitude(destination.getLatitude());
        detailDTO.setLongitude(destination.getLongitude());
        detailDTO.setPopularity(destination.getPopularity());
        detailDTO.setPlaces(placeDTOs);
        return detailDTO;
    }
}
