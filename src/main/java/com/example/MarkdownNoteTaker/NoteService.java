package com.example.MarkdownNoteTaker;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.text.StringEscapeUtils;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vladsch.flexmark.html.HtmlRenderer;
import com.vladsch.flexmark.parser.Parser;
import com.vladsch.flexmark.util.ast.Node;

import lombok.extern.slf4j.Slf4j;



@Service
@Slf4j
public class NoteService{

    private final Parser parser;
    private final HtmlRenderer renderer;
    private final Repository repository;
    private static final PolicyFactory POLICY = Sanitizers.FORMATTING
            .and(Sanitizers.BLOCKS)
            .and(Sanitizers.LINKS);

    public NoteService(Repository repository) {
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
            log.info("MIME Type = {}", file.getContentType());
            //Check encoding properly as per file as accepting only utf-16 for now
            String mkcontent = new String (filebytes, StandardCharsets.UTF_16);
            log.info("Markdown content read successfully");
            return mkcontent;
            
        } catch (Exception e) {
            log.error("Erro reading file",e);
            return "Error processing markdown file.";
        }
    }

    // Converts a file to html content after sanitization
    public String FiletoHtml(String content){

        try{
            
            Node document = parser.parse(content);
            
            String html = renderer.render(document);
            log.info("Markdown parsed successfully");
            return POLICY.sanitize(html);
            
            
        }
        catch (Exception e){
            log.error("Error reading file", e);
            return "Error processing markdown file.";
        }
    }

    //Getting file name without extension and after sanitization
    public String getTitle(MultipartFile file){
        String fileName = file.getOriginalFilename();
        log.info("File name extracted: {}", fileName);
        if(fileName==null){
            return "Untitle Note";
        }

        if(fileName.endsWith(".md")){
            fileName=fileName.substring(0, fileName.lastIndexOf(".md"));
        }
        else{
            throw new IllegalArgumentException("Invalid file type. Only .md files are supported.");
        }
        return StringEscapeUtils.escapeHtml3(fileName);

        
    }
    //Saving note to database
    public Note saveNote(MultipartFile file){
        
        String mkcontent= filetomkd(file);
        String htmlcontent= FiletoHtml(mkcontent);
        String title= getTitle(file);
        Note note = Note.builder()
                .title(title)
                .content(mkcontent)
                .htmlContent(htmlcontent)
                .createdAt(LocalDateTime.now())
                .build();
        return repository.save(note);
    }

    //Getting note in html by id
    public String getNotehtmlbyId(long id){
        Note resp = repository.findById(id).orElse(null);
        if(resp!=null){
            return resp.getHtmlContent();
        }
        else{
            throw new IllegalArgumentException("Note not found with id: " + id);
        }
    }
    //returning all notes
    public List<Note> getAllNotes(){
        return repository.findAll();
    }


    //Grammar Service 

    public String grammarCheck(String content){
        
    }
}
