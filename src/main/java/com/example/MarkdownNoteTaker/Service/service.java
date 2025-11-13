package com.example.MarkdownNoteTaker.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class service {
    
    public String ack(MultipartFile file){
        try {
            String fileName = file.getOriginalFilename();
            return "File " + fileName + " received successfully!";
        } catch (Exception e) {
            return "Failed to process the file.";
        }
    }
}
