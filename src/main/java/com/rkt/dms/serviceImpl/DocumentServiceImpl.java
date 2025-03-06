// package com.rkt.dms.serviceImpl;

// import com.rkt.dms.dto.document.DocumentDto;
// import com.rkt.dms.entity.document.DocumentEntity;
// import com.rkt.dms.repository.document.DocumentRepository;
// import com.rkt.dms.service.DocumentService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// public class DocumentServiceImpl implements DocumentService {

//     @Autowired
//     private DocumentRepository documentRepository;

//     @Override
//     public DocumentDto uploadDocument(MultipartFile file, String documentType) throws IOException {
//         // Convert MultipartFile to byte array
//         byte[] fileData = file.getBytes();

//         // Create document entity
//         DocumentEntity document = DocumentEntity.builder()
//                 .documentName(file.getOriginalFilename())
//                 .documentType(documentType)
//                 .uploadDate(LocalDateTime.now())
//                 .fileData(fileData) // Store in BLOB format
//                 .build();

//         // Save to database
//         document = documentRepository.save(document);

//         return new DocumentDto(document.getId(), document.getDocumentName(), document.getDocumentType(),
//                 document.getUploadDate(), document.getFileData());
//     }

//     @Override
//     public List<DocumentDto> getDocumentsByType(String documentType) {
//         if (documentType != null) {
//             return documentRepository.findByDocumentType(documentType)
//                     .stream().map(doc -> new DocumentDto(doc.getId(), doc.getDocumentName(), doc.getDocumentType(),
//                             doc.getUploadDate(), doc.getFileData()))
//                     .collect(Collectors.toList());
//         }
//         return documentRepository.findAll()
//         .stream().map(doc -> new DocumentDto(doc.getId(), doc.getDocumentName(), doc.getDocumentType(),
//                 doc.getUploadDate(), doc.getFileData()))
//         .collect(Collectors.toList());
//         }

//     @Override
//     public byte[] downloadDocument(Long documentId) {
//         DocumentEntity document = documentRepository.findById(documentId)
//                 .orElseThrow(() -> new RuntimeException("Document not found"));
//         return document.getFileData();
//     }
// }
package com.rkt.dms.serviceImpl;

import com.rkt.dms.dto.document.ActivityDTO;
import com.rkt.dms.dto.document.AuthorDTO;
import com.rkt.dms.dto.document.DocumentDto;
import com.rkt.dms.dto.document.PermissionDTO;
import com.rkt.dms.entity.document.ActivityEntity;
import com.rkt.dms.entity.document.AuthorEntity;
import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.entity.document.PermissionEntity;
import com.rkt.dms.repository.document.DocumentRepository;
import com.rkt.dms.service.DocumentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {

        @Autowired
        private DocumentRepository documentRepository;

        @Override
        public DocumentDto createDocument(MultipartFile file, DocumentDto documentDTO) {
                try {
                        // Step 1: Create DocumentEntity with metadata
                        DocumentEntity document = mapToEntity(documentDTO);

                        // Step 2: Upload file (store in the same entity)
                        uploadFile(file, document);

                        // Step 3: Save updated document to DB
                        document = documentRepository.save(document);

                        return mapToDTO(document);
                } catch (IOException e) {
                        e.printStackTrace();
                }
                return null;
        }

        public void uploadFile(MultipartFile file, DocumentEntity document) throws IOException {
                // Convert MultipartFile to byte array
                byte[] fileData = file.getBytes();

                // Update existing document entity with file data
                document.setFileData(fileData); // Store in BLOB format
                document.setFileType(file.getContentType()); // Set file type
                document.setDocumentName(file.getOriginalFilename()); // Set file name
                document.setSize(file.getSize()); // Set file size
        }

        @Override
        public byte[] downloadDocument(Long documentId) {
                DocumentEntity document = documentRepository.findById(documentId)
                                .orElseThrow(() -> new RuntimeException("Document not found"));
                return document.getFileData();
        }

        @Override
        public List<DocumentDto> getDocumentsByType(String documentType) {
                // if (documentType != null) {
                //         return documentRepository.findByDocumentType(documentType)
                //                         .stream()
                //                         .map(doc -> new DocumentDto(doc.getId(), doc.getDocumentName(),
                //                                         doc.getDocumentType(),
                //                                         doc.getUploadDate(), doc.getFileData()))
                //                         .collect(Collectors.toList());
                // }
                // return documentRepository.findAll()
                //                 .stream()
                //                 .map(doc -> new DocumentDto(doc.getId(), doc.getDocumentName(), doc.getDocumentType(),
                //                                 doc.getUploadDate(), doc.getFileData()))
                //                 .collect(Collectors.toList());
                return null;
        }

        @Override
        public DocumentDto getDocumentById(Long id) {
                DocumentEntity document = documentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Document not found"));
                return mapToDTO(document);
        }

        @Override
        public List<DocumentDto> getAllDocuments() {
                return documentRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
        }

        @Override
        public void deleteDocument(Long id) {
                documentRepository.deleteById(id);
        }

        private DocumentDto mapToDTO(DocumentEntity document) {
                return DocumentDto.builder()
                                .id(document.getId())
                                .documentName(document.getDocumentName())
                                .fileType(document.getFileType())
                                .srcUrl(document.getSrcUrl())
                                .size(document.getSize())
                                .uploadDate(document.getUploadDate())
                                .recent(document.isRecent())
                                .author(document.getAuthor() != null ? new AuthorDTO(
                                                document.getAuthor().getName(),
                                                document.getAuthor().getEmail(),
                                                document.getAuthor().getImg()) : null)
                                .activities(document.getActivities().stream()
                                                .map(activity -> new ActivityDTO(activity.getUserName(),
                                                                activity.getUserImg(),
                                                                activity.getActionType(),
                                                                activity.getTimestamp()))
                                                .collect(Collectors.toList()))
                                .permissions(document.getPermissions().stream()
                                                .map(permission -> new PermissionDTO(permission.getUserName(),
                                                                permission.getUserImg(),
                                                                permission.getRole()))
                                                .collect(Collectors.toList()))
                                .build();
        }

        private DocumentEntity mapToEntity(DocumentDto documentDTO) {
                DocumentEntity document = DocumentEntity.builder()
                                .documentName(documentDTO.getDocumentName())
                                .fileType(documentDTO.getFileType())
                                .srcUrl(documentDTO.getSrcUrl())
                                .size(documentDTO.getSize())
                                .uploadDate(documentDTO.getUploadDate())
                                .recent(documentDTO.isRecent())
                                .build();

                if (documentDTO.getAuthor() != null) {
                        document.setAuthor(AuthorEntity.builder()
                                        .name(documentDTO.getAuthor().getName())
                                        .email(documentDTO.getAuthor().getEmail())
                                        .img(documentDTO.getAuthor().getImg())
                                        .build());
                }

                document.setActivities(documentDTO.getActivities().stream()
                                .map(activityDTO -> ActivityEntity.builder()
                                                .userName(activityDTO.getUserName())
                                                .userImg(activityDTO.getUserImg())
                                                .actionType(activityDTO.getActionType())
                                                .timestamp(activityDTO.getTimestamp())
                                                .document(document)
                                                .build())
                                .collect(Collectors.toList()));

                document.setPermissions(documentDTO.getPermissions().stream()
                                .map(permissionDTO -> PermissionEntity.builder()
                                                .userName(permissionDTO.getUserName())
                                                .userImg(permissionDTO.getUserImg())
                                                .role(permissionDTO.getRole())
                                                .document(document)
                                                .build())
                                .collect(Collectors.toList()));

                return document;
        }
}
