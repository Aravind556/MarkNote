package com.example.MarkdownNoteTaker.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.MarkdownNoteTaker.Service.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/hi")
public class controller {

    private static final Logger logger = LoggerFactory.getLogger(controller.class);

    private final service service;
    public controller(service service){
        this.service = service;
    }

    @GetMapping()
    public String getMethodName() {
        return  "Hi !";
    }

    @PostMapping("/file")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try{
            String response = service.ack(file);
            logger.info("File upload called");
            return ResponseEntity.status(200).body(response);
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("File upload failed.");
        }
    }
}
