package com.rkt.dms.dto.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorDTO {
    private String name;
    private String email;
    private String img;
}
