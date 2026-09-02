package com.travelapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelapp.dto.*;
import com.travelapp.exception.InvalidTripException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ChatService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public ChatResponseDTO chat(ChatRequestDTO request) {
        if (request == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return new ChatResponseDTO("How can I help you plan your trip today?");
        }

        // Build prompt with destination context if available
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a helpful travel planning assistant for TravelApp. ");
        prompt.append("Answer questions politely and concisely about travel, sightseeing, duration, best time to visit, food, and culture. ");
        prompt.append("If asked completely non-travel questions, politely redirect toward travel planning.\n\n");

        if (request.getDestination() != null && !request.getDestination().trim().isEmpty()) {
            prompt.append("Context for destination: ").append(request.getDestination());
            if (request.getCountry() != null) prompt.append(", ").append(request.getCountry());
            if (request.getContinent() != null) prompt.append(" (").append(request.getContinent()).append(")");
            prompt.append("\n");
            if (request.getCategory() != null) prompt.append("Category: ").append(request.getCategory()).append("\n");
            if (request.getBestTimeToVisit() != null) prompt.append("Best Time to Visit: ").append(request.getBestTimeToVisit()).append("\n");
            if (request.getDescription() != null) prompt.append("Description: ").append(request.getDescription()).append("\n");
            if (request.getFamousPlaces() != null) prompt.append("Famous Places: ").append(request.getFamousPlaces()).append("\n");
            prompt.append("\n");
        }

        prompt.append("User Question: ").append(request.getMessage().trim());

        if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.equals("your_gemini_api_key")) {
            try {
                String responseText = callGeminiApi(prompt.toString());
                if (responseText != null && !responseText.trim().isEmpty()) {
                    return new ChatResponseDTO(responseText.trim());
                }
            } catch (Exception ex) {
                // Fallback on API failure
            }
        }

        // Contextual smart response fallback if API key is unconfigured or call fails
        return new ChatResponseDTO(generateFallbackChatResponse(request));
    }

    public ItineraryResponseDTO generateItinerary(ItineraryRequestDTO request) {
        if (request == null || request.getDestination() == null || request.getDestination().trim().isEmpty()) {
            throw new InvalidTripException("Destination is required");
        }

        if (request.getDays() == null || request.getDays() < 1 || request.getDays() > 14) {
            throw new InvalidTripException("Trip duration must be between 1 and 14 days");
        }

        int days = request.getDays();
        String destination = request.getDestination().trim();
        String country = request.getCountry() != null ? request.getCountry().trim() : "";
        String style = request.getTravelStyle() != null ? request.getTravelStyle().trim() : "Standard";
        String interestsStr = (request.getInterests() != null && !request.getInterests().isEmpty())
                ? String.join(", ", request.getInterests())
                : "Culture, Food, Highlights";

        String prompt = String.format(
                "Generate a structured %d-day travel itinerary for %s %s. Travel style: %s. Interests: %s.\n" +
                "Return ONLY a valid JSON object matching EXACTLY this structure:\n" +
                "{\n" +
                "  \"destination\": \"%s\",\n" +
                "  \"days\": %d,\n" +
                "  \"summary\": \"A brief summary of the itinerary.\",\n" +
                "  \"itinerary\": [\n" +
                "    {\n" +
                "      \"day\": 1,\n" +
                "      \"title\": \"Day 1 Title\",\n" +
                "      \"activities\": [\n" +
                "        { \"time\": \"Morning\", \"title\": \"Activity Title\", \"description\": \"Activity details\" },\n" +
                "        { \"time\": \"Afternoon\", \"title\": \"Activity Title\", \"description\": \"Activity details\" },\n" +
                "        { \"time\": \"Evening\", \"title\": \"Activity Title\", \"description\": \"Activity details\" }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}\n" +
                "Do NOT include markdown formatting or extra text outside JSON.",
                days, destination, country, style, interestsStr, destination, days
        );

        if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.equals("your_gemini_api_key")) {
            try {
                String rawResponse = callGeminiApi(prompt);
                if (rawResponse != null && !rawResponse.trim().isEmpty()) {
                    String cleanJson = cleanJsonString(rawResponse);
                    ItineraryResponseDTO dto = objectMapper.readValue(cleanJson, ItineraryResponseDTO.class);
                    if (dto != null && dto.getItinerary() != null && !dto.getItinerary().isEmpty()) {
                        return dto;
                    }
                }
            } catch (Exception ex) {
                // Fallback to structured fallback generator if API fails
            }
        }

        // Return structured fallback itinerary matching exact schema
        return generateFallbackItinerary(destination, country, days, style, interestsStr);
    }

    private String callGeminiApi(String textPrompt) throws Exception {
        String endpoint = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> part = new HashMap<>();
        part.put("text", textPrompt);

        List<Map<String, Object>> parts = new ArrayList<>();
        parts.add(part);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", parts);

        List<Map<String, Object>> contents = new ArrayList<>();
        contents.add(content);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", contents);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<JsonNode> response = restTemplate.postForEntity(endpoint, entity, JsonNode.class);

        JsonNode root = response.getBody();
        if (root != null && root.path("candidates").isArray() && root.path("candidates").size() > 0) {
            JsonNode candidate = root.path("candidates").get(0);
            JsonNode responseParts = candidate.path("content").path("parts");
            if (responseParts.isArray() && responseParts.size() > 0) {
                return responseParts.get(0).path("text").asText();
            }
        }
        return null;
    }

    private String cleanJsonString(String raw) {
        String s = raw.trim();
        if (s.startsWith("```json")) {
            s = s.substring(7);
        } else if (s.startsWith("```")) {
            s = s.substring(3);
        }
        if (s.endsWith("```")) {
            s = s.substring(0, s.length() - 3);
        }
        return s.trim();
    }

    private String generateFallbackChatResponse(ChatRequestDTO request) {
        String msg = request.getMessage() != null ? request.getMessage().toLowerCase() : "";
        String dest = request.getDestination() != null ? request.getDestination() : "this destination";

        if (msg.contains("how many days") || msg.contains("duration") || msg.contains("how long")) {
            return "For " + dest + ", spending 3 to 5 days is ideal to experience the main highlights, local culture, and top attractions at a comfortable pace.";
        }
        if (msg.contains("best time") || msg.contains("when to visit") || msg.contains("season")) {
            String best = request.getBestTimeToVisit() != null ? request.getBestTimeToVisit() : "spring and autumn";
            return "The best time to visit " + dest + " is generally " + best + ", offering pleasant weather and great sightseeing conditions.";
        }
        if (msg.contains("must-see") || msg.contains("places") || msg.contains("attractions") || msg.contains("sight")) {
            String places = request.getFamousPlaces() != null ? request.getFamousPlaces() : "the main historic landmarks and cultural centers";
            return "Top must-see spots in " + dest + " include: " + places + ". Make sure to reserve tickets ahead of time for popular venues!";
        }
        if (msg.contains("food") || msg.contains("eat") || msg.contains("cuisine")) {
            return "When visiting " + dest + ", be sure to sample the traditional local dishes, authentic street food markets, and popular neighborhood cafes.";
        }
        if (msg.contains("family") || msg.contains("kids")) {
            return dest + " is very family-friendly with plenty of parks, interactive cultural sites, and accessible transportation.";
        }

        return "Visiting " + dest + " is a wonderful experience! You can explore famous landmarks, sample local cuisine, or click 'Plan My Trip' to generate a day-by-day itinerary.";
    }

    private ItineraryResponseDTO generateFallbackItinerary(String destination, String country, int days, String style, String interests) {
        String summary = String.format("A custom %d-day %s itinerary for %s, %s focusing on %s.", days, style.toLowerCase(), destination, country, interests);
        List<ItineraryDayDTO> dayList = new ArrayList<>();

        for (int i = 1; i <= days; i++) {
            List<ItineraryActivityDTO> activities = new ArrayList<>();
            if (i == 1) {
                activities.add(new ItineraryActivityDTO("Morning", "Arrival & Hotel Check-in", "Settle into your accommodation and get oriented with the city center."));
                activities.add(new ItineraryActivityDTO("Afternoon", "Historic Center Exploration", "Take a walking tour around the main city square and landmark monuments."));
                activities.add(new ItineraryActivityDTO("Evening", "Welcome Dinner", "Enjoy authentic local cuisine at a recommended traditional restaurant."));
            } else if (i == days) {
                activities.add(new ItineraryActivityDTO("Morning", "Local Market & Souvenirs", "Browse local markets for unique handicrafts, gifts, and culinary treats."));
                activities.add(new ItineraryActivityDTO("Afternoon", "Scenic Viewpoint", "Visit a famous panoramic lookout point for final photos of " + destination + "."));
                activities.add(new ItineraryActivityDTO("Evening", "Farewell Walk & Departure", "Relax with a quiet evening walk before heading to your departure terminal."));
            } else {
                activities.add(new ItineraryActivityDTO("Morning", "Top Cultural Attraction", "Explore renowned museums or iconic architectural landmarks in " + destination + "."));
                activities.add(new ItineraryActivityDTO("Afternoon", "Neighborhood & Culinary Tour", "Discover charming side streets, artisan shops, and local food spots."));
                activities.add(new ItineraryActivityDTO("Evening", "Evening Entertainment & Dining", "Experience the vibrant evening atmosphere, riverside walks, or local shows."));
            }
            dayList.add(new ItineraryDayDTO(i, "Day " + i + " — Discover " + destination, activities));
        }

        return new ItineraryResponseDTO(destination, days, summary, dayList);
    }
}
