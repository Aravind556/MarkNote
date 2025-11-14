package com.example.MarkdownNoteTaker;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;
import com.vladsch.flexmark.html.HtmlRenderer;
import com.vladsch.flexmark.util.ast.Node;
import com.vladsch.flexmark.parser.Parser;



@Service
@Slf4j
public class service {

    private final Parser parser;
    private final HtmlRenderer renderer;
    private final Repository repository;

    public service(Repository repository) {
        this.repository = repository;
        this.parser = Parser.builder().build();
        this.renderer = HtmlRenderer.builder().build();
    }
    
    public String ack(MultipartFile file){
        try {
            String fileName = file.getOriginalFilename();
            return "File " + fileName + " received successfully!";
        } catch (Exception e) {
            log.error("Error processing file", e);
            return "Failed to process the file.";
        }
    }

    public String filetomkd(MultipartFile file){
        try {
            byte[] filebytes= file.getBytes();
            String mkcontent = new String (filebytes, StandardCharsets.UTF_8);
            log.info("Markdown content read successfully");
            return mkcontent;
        } catch (Exception e) {
            log.error("Erro reading file",e);
            return "Error processing markdown file.";
        }
    }

    // Converts a file to html content
    public String FiletoHtml(MultipartFile file){

        try{
            String content = filetomkd(file);
            Node document = parser.parse(content);
            log.info("Markdown parsed successfully");
            String html = renderer.render(document);
            return html;
            
        }
        catch (Exception e){
            log.error("Error reading file", e);
            return "Error processing markdown file.";
        }
    }
    //getting file name without extension and after sanitization
    public String getTitle(MultipartFile file){
        String fileName = file.getOriginalFilename();
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(0, fileName.lastIndexOf('.'));
        } else {
            return fileName != null ? fileName : "Untitled";

    }
    }

    public Note saveNote(MultipartFile file, Repository repository){
        
        String mkcontent= filetomkd(file);
        String htmlcontent= FiletoHtml(file);
        String title= getTitle(file);
        Note note = Note.builder()
                .title(title)
                .content(mkcontent)
                .htmlContent(htmlcontent)
                .createdAt(LocalDateTime.now())
                .build();
        return repository.save(note);
    }
}
