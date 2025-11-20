package com.example.MarkdownNoteTaker;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.MarkdownNoteTaker.NoteService.Issue;


@RestController
@RequestMapping("/hi")
public class NoteController {

    private static final Logger logger = LoggerFactory.getLogger(NoteController.class);

    private final NoteService service;
    public NoteController(NoteService service){
        this.service = service;
    }

    @GetMapping()
    public String getMethodName() {
        return  "Hi !";
    }

    @PostMapping("/file")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try{
            Note response = service.saveNote(file);
            logger.info("File upload called");
            return ResponseEntity.status(200).body(response);
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e){
            logger.error("Error uploading file", e);
            return ResponseEntity.status(500).body("Internal server error");
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<String> GetHtmlById(@PathVariable Long id){
        try{
            logger.info("Retrieving note with id: {}", id);
            return ResponseEntity
                .ok()
                .contentType(MediaType.TEXT_HTML)
                .body(service.getNotehtmlbyId(id));
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e){
            logger.error("Error retrieving note", e);
            return ResponseEntity.status(500).body("Internal server error");
        }
    }
    @GetMapping("/all")
    public ResponseEntity<List<Note>> getAllNotes() {
        try {
            List<Note> notes = service.getAllNotes();
            return ResponseEntity.ok(notes);
            
        } catch (Exception e) {
            logger.error("Error retrieving notes", e);
            return ResponseEntity.status(500).body(null);
        }
        
    }

    @PostMapping("/grammar")
    public ResponseEntity<List<Issue>> Grammar(@RequestParam("File") MultipartFile file){ 
        //TODO: process POST request
        try{
            String mkcontent=service.filetomkd(file);
            return ResponseEntity.ok(service.grammarCheck(mkcontent));
        }
        catch (Exception e){
            logger.error("Error in grammar check", e);
            return ResponseEntity.status(500).body(null);
        }
    
    }
    
}
    

