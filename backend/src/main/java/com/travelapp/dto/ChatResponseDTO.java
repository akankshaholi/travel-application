package com.travelapp.dto;

public class ChatResponseDTO {
    private String message;

    public ChatResponseDTO() {}

    public ChatResponseDTO(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
