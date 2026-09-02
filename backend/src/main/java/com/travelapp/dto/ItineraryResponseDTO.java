package com.travelapp.dto;

import java.util.ArrayList;
import java.util.List;

public class ItineraryResponseDTO {
    private String destination;
    private int days;
    private String summary;
    private List<ItineraryDayDTO> itinerary = new ArrayList<>();

    public ItineraryResponseDTO() {}

    public ItineraryResponseDTO(String destination, int days, String summary, List<ItineraryDayDTO> itinerary) {
        this.destination = destination;
        this.days = days;
        this.summary = summary;
        this.itinerary = itinerary != null ? itinerary : new ArrayList<>();
    }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public int getDays() { return days; }
    public void setDays(int days) { this.days = days; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<ItineraryDayDTO> getItinerary() { return itinerary; }
    public void setItinerary(List<ItineraryDayDTO> itinerary) { this.itinerary = itinerary; }
}
