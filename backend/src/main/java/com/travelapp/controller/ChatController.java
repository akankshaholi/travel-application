package com.travelapp.controller;

import com.travelapp.dto.ChatRequestDTO;
import com.travelapp.dto.ChatResponseDTO;
import com.travelapp.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request) {
        return ResponseEntity.ok(chatService.chat(request));
    }
}
