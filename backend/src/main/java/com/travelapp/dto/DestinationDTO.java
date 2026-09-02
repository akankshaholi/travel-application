package com.travelapp.dto;

public class DestinationDTO {
    private Long id;
    private String name;
    private String country;
    private String continent;
    private String shortDescription;
    private String category;
    private Integer popularity;

    public DestinationDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getContinent() { return continent; }
    public void setContinent(String continent) { this.continent = continent; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getPopularity() { return popularity; }
    public void setPopularity(Integer popularity) { this.popularity = popularity; }
}
