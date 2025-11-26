# Backend Endpoints Needed for Full Frontend Functionality

The frontend is designed to work with the current backend, but some features require additional endpoints. Here's what needs to be added:

## Required Endpoints

### 1. Get Note by ID as JSON
**Current:** `GET /hi/{id}` returns HTML string  
**Needed:** `GET /hi/notes/{id}` returns Note JSON object

```java
@GetMapping("/notes/{id}")
public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
    try {
        Note note = service.getNoteById(id); // Add this method to service
        return ResponseEntity.ok(note);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(null);
    } catch (Exception e) {
        logger.error("Error retrieving note", e);
        return ResponseEntity.status(500).body(null);
    }
}
```

**Service method needed:**
```java
public Note getNoteById(long id) {
    return repository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + id));
}
```

### 2. AI Correction Endpoint
**Current:** Not available  
**Needed:** `POST /hi/ai-correct` returns corrected text and issues

```java
@PostMapping("/ai-correct")
public ResponseEntity<AICorrectionResponse> aiCorrect(@RequestBody String content) {
    try {
        AICorrectionResponse response = service.aiCorrect(content);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        logger.error("Error in AI correction", e);
        return ResponseEntity.status(500).body(null);
    }
}
```

**Service method needed:**
```java
public AICorrectionResponse aiCorrect(String content) {
    // Use existing Gemini integration
    // Return both correctedText and issues
    // Similar to grammarCheck but return full response
}
```

**Response DTO:**
```java
public record AICorrectionResponse(
    String correctedText,
    List<Issue> issues
) {}
```

### 3. Grammar Check Response Enhancement
**Current:** `POST /hi/grammar` returns only `List<Issue>`  
**Optional:** Return full response with `correctedText`

The frontend can work with just issues, but having correctedText would be better for UX.

## Current Working Endpoints

✅ `GET /hi/all` - Get all notes  
✅ `POST /hi/file` - Upload/save note  
✅ `POST /hi/live` - Live grammar check  
✅ `POST /hi/grammar` - Grammar check (returns issues)

## Frontend Workarounds

The frontend currently:
- Fetches notes from the list to get a note by ID (works but inefficient)
- Shows error message when AI correction is attempted (graceful degradation)
- Works with grammar issues only (no correctedText needed for basic functionality)

## Priority

1. **High:** Get Note by ID endpoint (for better performance)
2. **Medium:** AI Correction endpoint (for full feature set)
3. **Low:** Grammar check with correctedText (nice to have)

