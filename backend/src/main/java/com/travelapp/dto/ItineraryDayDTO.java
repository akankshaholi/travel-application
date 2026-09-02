package com.travelapp.dto;

import java.util.ArrayList;
import java.util.List;

public class ItineraryDayDTO {
    private int day;
    private String title;
    private List<ItineraryActivityDTO> activities = new ArrayList<>();

    public ItineraryDayDTO() {}

    public ItineraryDayDTO(int day, String title, List<ItineraryActivityDTO> activities) {
        this.day = day;
        this.title = title;
        this.activities = activities != null ? activities : new ArrayList<>();
    }

    public int getDay() { return day; }
    public void setDay(int day) { this.day = day; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public List<ItineraryActivityDTO> getActivities() { return activities; }
    public void setActivities(List<ItineraryActivityDTO> activities) { this.activities = activities; }
}
