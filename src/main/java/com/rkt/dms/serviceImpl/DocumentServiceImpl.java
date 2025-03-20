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
import com.rkt.dms.entity.ProjectFilesEntity;
import com.rkt.dms.entity.UserEntity;
import com.rkt.dms.entity.document.ActivityEntity;
import com.rkt.dms.entity.document.AuthorEntity;
import com.rkt.dms.entity.document.DocumentEntity;
import com.rkt.dms.entity.document.PermissionEntity;
import com.rkt.dms.repository.ProjectFilesRepository;
import com.rkt.dms.repository.UserRepository;
import com.rkt.dms.repository.document.ActivityRepository;
import com.rkt.dms.repository.document.AuthorRepository;
import com.rkt.dms.repository.document.DocumentRepository;
import com.rkt.dms.repository.document.PermissionRepository;
import com.rkt.dms.service.DocumentService;
import com.rkt.dms.utils.SecurityUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {

        @Autowired
        private DocumentRepository documentRepository;
        @Autowired
        private UserRepository userRepository;
        @Autowired
        private ActivityRepository activityRepository;
        @Autowired
        private AuthorRepository authorRepository;
        @Autowired
        private PermissionRepository permissionRepository;
        @Autowired
        private ProjectFilesRepository folderRepository;

        @Override
        public DocumentDto createDocument(MultipartFile file, DocumentDto documentDTO) {
                try {
                        // Retrieve the current user's username
                        String currentUsername = SecurityUtils.getCurrentUsername();
                        UserEntity userEntity = userRepository.findByEmail(currentUsername);

                        // Step 1: Check if the folder exists
                        ProjectFilesEntity folderEntity = null;
                        if (documentDTO.getFolder() != null) {
                                folderEntity = folderRepository.findByLabel(documentDTO.getFolder())
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Folder not found: " + documentDTO.getFolder()));
                        }

                        // Step 2: Create DocumentEntity with metadata
                        DocumentEntity document = mapToEntity(documentDTO);

                        // Associate the folder if it exists
                        if (folderEntity != null) {
                                document.setProjectFile(folderEntity);
                        }

                        // Upload file (store in the same entity)
                        uploadFile(file, document);

                        // Save document first to get an ID
                        document = documentRepository.save(document);

                        // Save related entities
                        saveActivity(document, userEntity);
                        saveAuthor(document, userEntity);
                        savePermission(document, userEntity);

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

                Set<String> supportedTypes = new HashSet<>(Set.of("pdf", "txt", "doc",
                "docx", "xlsx", "pptx", "ppt", "jpg", "jpeg", "png", "csv", "xls"));
                if
                (!supportedTypes.contains(file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")
                + 1))) {
                throw new RuntimeException("Unsupported file type");
                }

                // Extract file extension
                String fileType =
                file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")
                + 1);

                System.out.println("File Type: " + fileType); // Output: pdf

                document.setDocumentType(file.getContentType()); // Set file type
                document.setFileType(fileType); // Set file type
                document.setDocumentName(file.getOriginalFilename()); // Set file name
                document.setSize(file.getSize()); // Set file size
                document.setUploadDate(LocalDateTime.now()); // Set upload 
        }

        /**
         * Saves the author details for the document.
         */
        private void saveAuthor(DocumentEntity document, UserEntity userEntity) {
                AuthorEntity authorEntity = AuthorEntity.builder()
                                .name(userEntity.getFirstName())
                                .email(userEntity.getEmail())
                                .img(userEntity.getImage())
                                .build();
                authorRepository.save(authorEntity);
                document.setAuthor(authorEntity); // Set author in the document entity
                documentRepository.save(document); // Save document with author reference
        }

        /**
         * Saves an activity log for the document and updates the document entity.
         */
        private void saveActivity(DocumentEntity document, UserEntity userEntity) {
                ActivityEntity activityEntity = ActivityEntity.builder()
                                .userName(userEntity.getFirstName())
                                .userImg(userEntity.getImage())
                                .actionType("CREATE")
                                .document(document)
                                .timestamp(Instant.now()) // Ensure timestamp is set
                                .build();

                activityRepository.save(activityEntity);

                // Add the activity to document and save
                if (document.getActivities() == null) {
                        document.setActivities(new ArrayList<>()); // Initialize list if null
                }
                document.getActivities().add(activityEntity);
                documentRepository.save(document);
        }

        /**
         * Saves the permission details for the document and updates the document
         * entity.
         */
        private void savePermission(DocumentEntity document, UserEntity userEntity) {
                PermissionEntity permissionEntity = PermissionEntity.builder()
                                .userName(userEntity.getFirstName())
                                .userImg(userEntity.getImage())
                                .role(userEntity.getRoles().get(0))
                                .document(document)
                                .build();

                permissionRepository.save(permissionEntity);

                // Add the permission to document and save
                if (document.getPermissions() == null) {
                        document.setPermissions(new ArrayList<>()); // Initialize list if null
                }
                document.getPermissions().add(permissionEntity);
                documentRepository.save(document);
        }

        @Override
        public DocumentEntity downloadDocument(Long documentId) {
                DocumentEntity document = documentRepository.findById(documentId)
                                .orElseThrow(() -> new RuntimeException("Document not found"));
                return document;
        }

        @Override
        public List<DocumentDto> getDocumentsByType(String documentType) {
                return null;
        }

        @Override
        public DocumentDto getDocumentById(Long id) {
                DocumentEntity document = documentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Document not found"));
                return mapToDTOWithDoc(document);
        }

        @Override
        public List<DocumentDto> getAllDocuments(Long folderId) {

                List<DocumentEntity> documents = documentRepository.findByProjectFileId(folderId);
                return documents.stream().map(this::mapToDTO).collect(Collectors.toList());
                // return
                // documentRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
        }

        @Override
        public void deleteDocument(Long id) {
                documentRepository.deleteById(id);
        }

        private DocumentDto mapToDTO(DocumentEntity document) {
                return DocumentDto.builder()
                                .id(document.getId())
                                .name(document.getDocumentName())
                                .fileType(document.getFileType())
                                // .srcUrl(document.getFileData() != null ? "data:" + document.getFileType() +
                                // ";base64,"
                                // + new String(document.getFileData()) : null)
                                .size(document.getSize())
                                .uploadDate(document.getUploadDate())
                                .folder(document.getProjectFile() != null ? document.getProjectFile().getLabel() : null)
                                .recent(document.isRecent())

                                // Handle null author
                                .author(document.getAuthor() != null ? new AuthorDTO(
                                                document.getAuthor().getName(),
                                                document.getAuthor().getEmail(),
                                                document.getAuthor().getImg()) : null)

                                // Handle null activities safely
                                .activities(document.getActivities() != null ? document.getActivities().stream()
                                                .map(activity -> new ActivityDTO(
                                                                activity.getUserName(),
                                                                activity.getUserImg(),
                                                                activity.getActionType(),
                                                                activity.getTimestamp()))
                                                .collect(Collectors.toList())
                                                : List.of())

                                // Handle null permissions safely
                                .permissions(document.getPermissions() != null ? document.getPermissions().stream()
                                                .map(permission -> new PermissionDTO(
                                                                permission.getUserName(),
                                                                permission.getUserImg(),
                                                                permission.getRole()))
                                                .collect(Collectors.toList())
                                                : List.of())
                                .build();
        }

        private DocumentDto mapToDTOWithDoc(DocumentEntity document) {
                return DocumentDto.builder()
                                .id(document.getId())
                                .name(document.getDocumentName())
                                .documentType(document.getDocumentType())
                                .fileType(document.getFileType())
                                .srcUrl(document.getFileData() != null ? "data:" + "application/"+document.getFileType() +
                                ";base64,"
                                + new String(document.getFileData()) : null)
                                .size(document.getSize())
                                .uploadDate(document.getUploadDate())
                                .folder(document.getProjectFile() != null ? document.getProjectFile().getLabel() : null)
                                .recent(document.isRecent())

                                // Handle null author
                                .author(document.getAuthor() != null ? new AuthorDTO(
                                                document.getAuthor().getName(),
                                                document.getAuthor().getEmail(),
                                                document.getAuthor().getImg()) : null)

                                // Handle null activities safely
                                .activities(document.getActivities() != null ? document.getActivities().stream()
                                                .map(activity -> new ActivityDTO(
                                                                activity.getUserName(),
                                                                activity.getUserImg(),
                                                                activity.getActionType(),
                                                                activity.getTimestamp()))
                                                .collect(Collectors.toList())
                                                : List.of())

                                // Handle null permissions safely
                                .permissions(document.getPermissions() != null ? document.getPermissions().stream()
                                                .map(permission -> new PermissionDTO(
                                                                permission.getUserName(),
                                                                permission.getUserImg(),
                                                                permission.getRole()))
                                                .collect(Collectors.toList())
                                                : List.of())
                                .build();
        }

        private DocumentEntity mapToEntity(DocumentDto documentDTO) {
                DocumentEntity document = DocumentEntity.builder()
                                .documentName(documentDTO.getName())
                                .fileType(documentDTO.getFileType())
                                .srcUrl(documentDTO.getSrcUrl())
                                .size(documentDTO.getSize())
                                .uploadDate(documentDTO.getUploadDate())
                                .recent(documentDTO.isRecent())
                                .build();

                // if (documentDTO.getAuthor() != null) {
                // document.setAuthor(AuthorEntity.builder()
                // .name(documentDTO.getAuthor().getName())
                // .email(documentDTO.getAuthor().getEmail())
                // .img(documentDTO.getAuthor().getImg())
                // .build());
                // }

                // document.setActivities(documentDTO.getActivities().stream()
                // .map(activityDTO -> ActivityEntity.builder()
                // .userName(activityDTO.getUserName())
                // .userImg(activityDTO.getUserImg())
                // .actionType(activityDTO.getActionType())
                // .timestamp(activityDTO.getTimestamp())
                // .document(document)
                // .build())
                // .collect(Collectors.toList()));

                // document.setPermissions(documentDTO.getPermissions().stream()
                // .map(permissionDTO -> PermissionEntity.builder()
                // .userName(permissionDTO.getUserName())
                // .userImg(permissionDTO.getUserImg())
                // .role(permissionDTO.getRole())
                // .document(document)
                // .build())
                // .collect(Collectors.toList()));

                return document;
        }
}
