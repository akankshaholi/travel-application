package com.travelapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.travelapp.dto.ImageResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class ImageService {

    @Value("${pexels.api.key:}")
    private String apiKey;

    @Value("${pexels.api.url:https://api.pexels.com/v1/search}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public ImageService() {
        this.restTemplate = new RestTemplate();
    }

    public ImageResponseDTO searchImage(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ImageResponseDTO();
        }

        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("your_pexels_api_key")) {
            return new ImageResponseDTO();
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiKey);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String targetUrl = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("query", query.trim())
                    .queryParam("per_page", 1)
                    .build()
                    .toUriString();

            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    targetUrl,
                    HttpMethod.GET,
                    entity,
                    JsonNode.class
            );

            JsonNode root = response.getBody();
            if (root != null && root.path("photos").isArray() && root.path("photos").size() > 0) {
                JsonNode photo = root.path("photos").get(0);
                JsonNode src = photo.path("src");

                String imageUrl = src.path("large").asText(src.path("medium").asText(null));
                String thumbnailUrl = src.path("medium").asText(src.path("small").asText(imageUrl));
                String photographer = photo.path("photographer").asText("");
                String photographerUrl = photo.path("photographer_url").asText("");
                String altText = photo.path("alt").asText(query);

                return new ImageResponseDTO(imageUrl, thumbnailUrl, photographer, photographerUrl, altText);
            }
        } catch (Exception ex) {
            // Log error silently, return fallback empty DTO to prevent backend/frontend crash
        }

        return new ImageResponseDTO();
    }
}
