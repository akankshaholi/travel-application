package com.travelapp.dto;

public class ItineraryActivityDTO {
    private String time;
    private String title;
    private String description;

    public ItineraryActivityDTO() {}

    public ItineraryActivityDTO(String time, String title, String description) {
        this.time = time;
        this.title = title;
        this.description = description;
    }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
