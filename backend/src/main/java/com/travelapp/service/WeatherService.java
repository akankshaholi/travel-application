package com.travelapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.travelapp.dto.WeatherResponseDTO;
import com.travelapp.exception.InvalidCoordinatesException;
import com.travelapp.exception.WeatherServiceUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${openweather.api.key:}")
    private String apiKey;

    @Value("${openweather.api.url:https://api.openweathermap.org/data/2.5/weather}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public WeatherService() {
        this.restTemplate = new RestTemplate();
    }

    public WeatherResponseDTO getWeather(Double lat, Double lon) {
        // Validation
        if (lat == null || lon == null || lat < -90.0 || lat > 90.0 || lon < -180.0 || lon > 180.0) {
            throw new InvalidCoordinatesException("Invalid latitude or longitude");
        }

        // Check if API key is configured
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("your_openweather_api_key")) {
            throw new WeatherServiceUnavailableException("Weather service is temporarily unavailable");
        }

        String requestUrl = String.format("%s?lat=%f&lon=%f&appid=%s&units=metric", apiUrl, lat, lon, apiKey);

        try {
            JsonNode root = restTemplate.getForObject(requestUrl, JsonNode.class);
            if (root == null) {
                throw new WeatherServiceUnavailableException("Weather service is temporarily unavailable");
            }

            WeatherResponseDTO dto = new WeatherResponseDTO();
            dto.setLatitude(lat);
            dto.setLongitude(lon);
            dto.setLocationName(root.path("name").asText("Unknown Location"));

            // System country
            JsonNode sys = root.path("sys");
            if (!sys.isMissingNode()) {
                dto.setCountry(sys.path("country").asText(""));
                dto.setSunrise(sys.path("sunrise").asLong(0));
                dto.setSunset(sys.path("sunset").asLong(0));
            }

            // Main stats
            JsonNode main = root.path("main");
            if (!main.isMissingNode()) {
                dto.setTemperature(main.path("temp").asDouble(0.0));
                dto.setFeelsLike(main.path("feels_like").asDouble(0.0));
                dto.setMinTemperature(main.path("temp_min").asDouble(0.0));
                dto.setMaxTemperature(main.path("temp_max").asDouble(0.0));
                dto.setHumidity(main.path("humidity").asInt(0));
                dto.setPressure(main.path("pressure").asInt(0));
            }

            // Weather condition array
            JsonNode weatherArray = root.path("weather");
            if (weatherArray.isArray() && weatherArray.size() > 0) {
                JsonNode weather = weatherArray.get(0);
                dto.setWeatherCondition(weather.path("main").asText(""));
                dto.setWeatherDescription(weather.path("description").asText(""));
                dto.setWeatherIcon(weather.path("icon").asText(""));
            }

            // Wind
            JsonNode wind = root.path("wind");
            if (!wind.isMissingNode()) {
                dto.setWindSpeed(wind.path("speed").asDouble(0.0));
            }

            // Visibility
            dto.setVisibility(root.path("visibility").asInt(0));

            return dto;
        } catch (Exception ex) {
            // Log internally if needed, but do not expose raw error or API key externally
            throw new WeatherServiceUnavailableException("Weather service is temporarily unavailable");
        }
    }
}
