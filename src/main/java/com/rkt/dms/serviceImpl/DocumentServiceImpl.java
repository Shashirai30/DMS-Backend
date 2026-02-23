
package com.rkt.dms.serviceImpl;

import com.rkt.dms.dto.NextNumberDto;
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
import com.rkt.dms.service.NextNumberService;
import com.rkt.dms.utils.SecurityUtils;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;

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
        @Autowired
        private NextNumberService nextNumberService;

        @Override
        public DocumentDto createDocument(MultipartFile file, DocumentDto documentDTO) {
                try {
                        String categoryCode = null;
                        String folderCode = null;
                        // Retrieve the current user's username
                        String currentUsername = SecurityUtils.getCurrentUsername();
                        UserEntity userEntity = userRepository.findByEmail(currentUsername);

                        // Step 1: Check if the folder exists
                        ProjectFilesEntity folderEntity = null;
                        if (documentDTO.getFolder() != null) {
                                folderEntity = folderRepository.findByLabel(documentDTO.getFolder())
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Folder not found: " + documentDTO.getFolder()));

                                folderCode = folderEntity.getCode();
                        }

                        // Step 2: Create DocumentEntity with metadata
                        DocumentEntity document = mapToEntity(documentDTO);

                        // Associate the folder if it exists
                        if (folderEntity != null) {
                                String name = documentDTO.getFileCategory();
                                if (name != null && name.contains("-")) {
                                        String[] parts = name.split("-", 2);
                                        document.setFileCategory(parts[0].trim());// e.g., "Payroll"

                                        // Optional: set a separate field for the code, e.g., "100"
                                        categoryCode = parts[1].trim();
                                }
                                document.setProjectFile(folderEntity);
                        }

                        List<NextNumberDto> nextNumberDtos = nextNumberService
                                        .getNNbyid(folderCode + "-" + categoryCode, null, null);

                        document.setDocumentNumber(nextNumberDtos.get(0).getDocNumber());

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
                if (!supportedTypes.contains(
                                file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")
                                                + 1))) {
                        throw new RuntimeException("Unsupported file type");
                }

                // Extract file extension
                String fileType = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")
                                + 1);

                System.out.println("File Type: " + fileType); // Output: pdf

                document.setDocumentType(file.getContentType()); // Set file type
                document.setFileType(fileType); // Set file type
                document.setDocumentName(file.getOriginalFilename().replaceAll("(?i)\\.pdf$", "")); // Set file name
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
        public Page<DocumentDto> getDocumentsSharedByUser(String userEmail, int page, int size, String sortBy,
                        String sortDir, String search, String folder, String year, String docName) {
                List<Long> docIds = permissionRepository.getDocumentIdsByUserEmailAndLinkShareTrue(userEmail);
                // Determine sorting order
                Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();

                // Create a pageable request
                Pageable pageable = PageRequest.of(page, size, sort);

                // Build Specification for filtering
                // Specification<DocumentEntity> spec = searchByEmailOrEmpCode(search);

                // Fetch paginated data
                // Page<DocumentEntity> sharedDocByUserName =
                // documentRepository.findByIdIn(spec,docIds, pageable);
                Page<DocumentEntity> sharedDocByUserName = documentRepository.findByIdIn(docIds, pageable);

                // Convert to DTO
                return sharedDocByUserName.map(this::mapToDTO);

        }

        // public static Specification<DocumentEntity> searchByEmailOrEmpCode(String
        // search) {
        // return (root,query, criteriaBuilder) -> {
        // List<Predicate> predicates = new ArrayList<>();

        // if (search != null && !search.isEmpty()) {
        // String searchPattern = "%" + search.toLowerCase() + "%";
        // predicates.add(criteriaBuilder.or(
        // criteriaBuilder.like(criteriaBuilder.lower(root.get("documentName")),
        // searchPattern),
        // criteriaBuilder.like(criteriaBuilder.lower(root.get("fileCategory")),
        // searchPattern)));
        // }

        // return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        // };
        // }

        @Override
        public DocumentDto getRenameDocuments(Long documentId, String newName, String fileCategory) {
                if (fileCategory != null && fileCategory.contains("-")) {
                        String[] parts = fileCategory.split("-", 2);
                        fileCategory = parts[0].trim(); // e.g., "Payroll"
                } else if (fileCategory != null) {
                        fileCategory = fileCategory.trim(); // if no '-' is present, take the whole string
                }
                DocumentEntity document = documentRepository.findById(documentId)
                                .orElseThrow(() -> new RuntimeException("Document not found"));
                document.setDocumentName(newName != null ? newName : document.getDocumentName());
                document.setFileCategory(fileCategory != null ? fileCategory : document.getFileCategory());
                return mapToDTO(documentRepository.save(document));
        }

        @Override
        public DocumentDto getDocumentById(Long id) {
                DocumentEntity document = documentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Document not found"));
                return mapToDTOWithDoc(document);
        }

        @Override
        public Page<DocumentDto> getAllDocuments(Long folderId, int page, int size, String sortBy, String sortDir,
                        String search, String fileCategory, String year, String docName, String docNumber) {
                // Determine sorting order
                Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();

                // Create a pageable request
                Pageable pageable = PageRequest.of(page, size, sort);

                // Fetch paginated data
                Page<DocumentEntity> documents = null;

                if (folderId != null && search == null && fileCategory == null && year == null) {
                        documents = documentRepository.findByProjectFileId(folderId, pageable);
                }
                if (docName != null && search == null && fileCategory == null && year == null) {
                        documents = documentRepository.findByProjectFileIdAndDocumentNameContainingIgnoreCase(folderId,
                                        pageable, docName);
                }
                if (docNumber != null && docName == null && search == null && fileCategory == null && year == null) {
                        documents = documentRepository.findByProjectFileIdAndDocumentNumberContainingIgnoreCase(
                                        folderId,
                                        pageable, docNumber);
                }
                if (fileCategory != null && year == null) {
                        documents = documentRepository.findByProjectFileIdAndFileCategory(folderId, pageable,
                                        fileCategory);
                }
                if (year != null && fileCategory == null) {
                        documents = documentRepository.findByProjectFileIdAndYear(folderId, year, pageable);
                }
                // Convert to DTO
                return documents.map(this::mapToDTO);
        }

        public void softDeleteFile(Long fileId) {
                DocumentEntity file = documentRepository.findById(fileId).orElseThrow();
                file.setIsDeleted(true);
                file.setDeletedAt(LocalDateTime.now());
                documentRepository.save(file);
        }

        @Transactional
        @Override
        public void deleteDocument(Long id) {
                Optional<DocumentEntity> optionalDoc = documentRepository.findById(id);

                if (optionalDoc.isPresent()) {
                        DocumentEntity document = optionalDoc.get();

                        // Break bidirectional relationship
                        ProjectFilesEntity projectFile = document.getProjectFile();
                        if (projectFile != null) {
                                projectFile.getDocuments().remove(document); // Remove from parent
                                document.setProjectFile(null); // Remove from child
                        }

                        documentRepository.delete(document); // Delete the document
                        System.out.println("Deleted document with ID: " + id);
                } else {
                        System.out.println("Document with ID " + id + " not found.");
                }
        }

        private DocumentDto mapToDTO(DocumentEntity document) {
                return DocumentDto.builder()
                                .id(document.getId())
                                .name(document.getDocumentName())
                                .documentNumber(document.getDocumentNumber())
                                .fileType(document.getFileType())
                                // .srcUrl(document.getFileData() != null ? "data:" + document.getFileType() +
                                // ";base64,"
                                // + new String(document.getFileData()) : null)
                                .size(document.getSize())
                                .fileCategory(document.getFileCategory())
                                .uploadDate(document.getUploadDate())
                                .folder(document.getProjectFile() != null ? document.getProjectFile().getLabel() : null)
                                .recent(document.isRecent())
                                .isDeleted(document.getIsDeleted())
                                .deletedAt(document.getDeletedAt())

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
                                                                permission.getRole(),
                                                                permission.getShareToken(),
                                                                permission.getUserImg()))
                                                .collect(Collectors.toList())
                                                : List.of())
                                .build();
        }

        private DocumentDto mapToDTOWithDoc(DocumentEntity document) {
                return DocumentDto.builder()
                                .id(document.getId())
                                .name(document.getDocumentName())
                                .documentNumber(document.getDocumentNumber())
                                .documentType(document.getDocumentType())
                                .fileType(document.getFileType())
                                .srcUrl(document.getFileData() != null
                                                ? "data:" + "application/" + document.getFileType() +
                                                                ";base64,"
                                                                + new String(document.getFileData())
                                                : null)
                                .size(document.getSize())
                                .uploadDate(document.getUploadDate())
                                .fileCategory(document.getFileCategory())
                                .folder(document.getProjectFile() != null ? document.getProjectFile().getLabel() : null)
                                .recent(document.isRecent())
                                .isDeleted(document.getIsDeleted())
                                .deletedAt(document.getDeletedAt())

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
                                                                permission.getRole(),
                                                                permission.getShareToken(),
                                                                permission.getUserImg()))
                                                .collect(Collectors.toList())
                                                : List.of())
                                .build();
        }

        private DocumentEntity mapToEntity(DocumentDto documentDTO) {
                DocumentEntity document = DocumentEntity.builder()
                                .documentName(documentDTO.getName())
                                .documentNumber(documentDTO.getDocumentNumber())
                                .fileType(documentDTO.getFileType())
                                .srcUrl(documentDTO.getSrcUrl())
                                .size(documentDTO.getSize())
                                .uploadDate(documentDTO.getUploadDate())
                                .fileCategory(documentDTO.getFileCategory())
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
