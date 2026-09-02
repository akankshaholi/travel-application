package com.travelapp.dto;

public class ChatRequestDTO {
    private String message;
    private String destination;
    private String country;
    private String continent;
    private String category;
    private String bestTimeToVisit;
    private String description;
    private String famousPlaces;

    public ChatRequestDTO() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getContinent() { return continent; }
    public void setContinent(String continent) { this.continent = continent; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBestTimeToVisit() { return bestTimeToVisit; }
    public void setBestTimeToVisit(String bestTimeToVisit) { this.bestTimeToVisit = bestTimeToVisit; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFamousPlaces() { return famousPlaces; }
    public void setFamousPlaces(String famousPlaces) { this.famousPlaces = famousPlaces; }
}
