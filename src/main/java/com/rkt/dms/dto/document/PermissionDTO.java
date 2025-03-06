package com.rkt.dms.dto.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionDTO {
    private String userName;
    private String userImg;
    private String role;
}
