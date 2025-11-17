package com.example.MarkdownNoteTaker;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.text.StringEscapeUtils;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
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
    private final Client client = new Client();
    private static final PolicyFactory POLICY = Sanitizers.FORMATTING
            .and(Sanitizers.BLOCKS)
            .and(Sanitizers.LINKS);

    public NoteService(Repository repository) {
        this.repository = repository;
        this.parser = Parser.builder().build();
        this.renderer = HtmlRenderer.builder().build();
    }

    public record GeminiRequest(String prompt) {}
    
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
        try{

            log.info("Starting grammar check via Gemini API");
            String prompt= "You are a professional grammar correction assistant.\n\n" +
            "You will receive text written in Markdown format. Your task is to correct ONLY the following:\n" +
            "- Grammar errors\n" +
            "- Spelling mistakes\n" +
            "- Punctuation errors\n" +
            "- Sentence clarity and readability (without changing tone or meaning)\n\n" +
            "Important rules:\n" +
            "- Do NOT change or remove any Markdown formatting (headings, bold, italics, lists, bullet points, code blocks, links, tables, quotes, etc.)\n" +
            "- Do NOT rewrite sentences unnecessarily or modify meaning\n" +
            "- Do NOT add new content or remove content\n" +
            "- Preserve line breaks and input structure exactly as provided\n" +
            "- Only make minimal corrections required for correctness and clarity\n\n" +
            "Your response must be returned strictly as a JSON object in the following structure:\n" +
            "{\n" +
            "  \"correctedText\": \"string - the fully corrected markdown text\",\n" +
            "  \"issues\": [\n" +
            "    {\n" +
            "      \"line\": number,\n" +
            "      \"original\": \"string - the original incorrect portion\",\n" +
            "      \"suggestion\": \"string - corrected text\",\n" +
            "      \"explanation\": \"string - brief reason\"\n" +
            "    }\n" +
            "  ]\n" +
            "}\n\n" +
            "Below is the Markdown text that needs correction. Apply the instructions above:\n" +
            "<<<START_OF_MARKDOWN>>>\n" +
            content + "\n" +
            "<<<END_OF_MARKDOWN>>>";

            log.info("Prompt constructed for Gemini API");

            GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash",
                prompt,
                null
            );
            return response.text();
            
        }
        catch(Exception e){
            log.error("Error in grammar check", e);
            return null;
        }
        
    }

    //DTO classes for Gemini response
    public record GeminiResponse(String correctedText, List<Issue> issues) {}
    public record Issue(
        int line,
        String original,
        String suggestion,
        String explanation
    ) {}
}
