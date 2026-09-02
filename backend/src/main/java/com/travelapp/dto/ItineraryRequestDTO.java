package com.travelapp.dto;

import java.util.List;

public class ItineraryRequestDTO {
    private String destination;
    private String country;
    private Integer days;
    private String travelStyle;
    private List<String> interests;

    public ItineraryRequestDTO() {}

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public Integer getDays() { return days; }
    public void setDays(Integer days) { this.days = days; }

    public String getTravelStyle() { return travelStyle; }
    public void setTravelStyle(String travelStyle) { this.travelStyle = travelStyle; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
}
