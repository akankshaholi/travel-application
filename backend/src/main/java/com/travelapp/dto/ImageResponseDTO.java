package com.travelapp.dto;

public class ImageResponseDTO {
    private String imageUrl;
    private String thumbnailUrl;
    private String photographer;
    private String photographerUrl;
    private String altText;

    public ImageResponseDTO() {}

    public ImageResponseDTO(String imageUrl, String thumbnailUrl, String photographer, String photographerUrl, String altText) {
        this.imageUrl = imageUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.photographer = photographer;
        this.photographerUrl = photographerUrl;
        this.altText = altText;
    }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getPhotographer() { return photographer; }
    public void setPhotographer(String photographer) { this.photographer = photographer; }

    public String getPhotographerUrl() { return photographerUrl; }
    public void setPhotographerUrl(String photographerUrl) { this.photographerUrl = photographerUrl; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }
}
