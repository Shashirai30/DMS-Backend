package com.rkt.dms.dto.document;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LatestShareDocDto {

    private Long id;

    private String role;

    private boolean isLinkShare;

    private Long sharedBy;

    private Long sharedWith;

    private LocalDateTime sharedAt;

    private Boolean isViewed;

    private Long folderId;

    private Long documentId;
}