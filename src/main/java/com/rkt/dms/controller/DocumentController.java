// package com.rkt.dms.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import com.rkt.dms.dto.document.DocumentDto;
// import com.rkt.dms.response.ResponseHandler;
// import com.rkt.dms.service.DocumentService;

// import java.io.IOException;

// @RestController
// @RequestMapping("/documents")
// public class DocumentController {

//     @Autowired
//     private DocumentService documentService;

//     @PostMapping("/upload")
//     public ResponseEntity<?> uploadDocument(
//             @RequestParam(value = "file") MultipartFile file,
//             @RequestPart("documentType") String documentType) throws IOException {

//         DocumentDto uploadedDocument = documentService.uploadDocument(file, documentType);
//         return ResponseHandler.generateResponse("Uploaded Successfully!", HttpStatus.OK, uploadedDocument);
//     }

    // @GetMapping("/type")
    // public ResponseEntity<?> getDocumentsByType(@RequestParam(value = "documentType", required = false) String documentType) {
    //     return ResponseHandler.generateResponse("Successfully retrieved data!", HttpStatus.OK, documentService.getDocumentsByType(documentType));
    // }

// @GetMapping("/download/{documentId}")
// public ResponseEntity<byte[]> downloadDocument(@PathVariable Long documentId) {
//     byte[] documentData = documentService.downloadDocument(documentId);

//     return ResponseEntity.ok()
//             .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=document.pdf")
//             .contentType(MediaType.APPLICATION_OCTET_STREAM)
//             .body(documentData);
// }
// }

package com.rkt.dms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rkt.dms.dto.document.DocumentDto;
import com.rkt.dms.response.ResponseHandler;
import com.rkt.dms.service.DocumentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private ObjectMapper objectMapper; // Inject Jackson ObjectMapper

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestPart("documentDTO") String documentDTO) {
        try {
            // Convert JSON string to DocumentDto object
            DocumentDto covertDocumentDTO = objectMapper.readValue(documentDTO, DocumentDto.class);
            DocumentDto savedDocument = documentService.createDocument(file, covertDocumentDTO);
            return ResponseHandler.generateResponse("Uploaded Successfully!", HttpStatus.OK, savedDocument);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        byte[] documentData = documentService.downloadDocument(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=document.pdf")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(documentData);
    }

    @GetMapping("/type")
    public ResponseEntity<?> getDocumentsByType(@RequestParam(value = "documentType", required = false) String documentType) {
        return ResponseHandler.generateResponse("Successfully retrieved data!", HttpStatus.OK, documentService.getDocumentsByType(documentType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDto> getDocumentById(@PathVariable Long id) {
        try {
            DocumentDto document = documentService.getDocumentById(id);
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<DocumentDto>> getAllDocuments() {
        List<DocumentDto> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
