package com.rkt.dms.dto.document;


import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityDTO {
    private String userName;
    private String userImg;
    private String actionType;
    private Instant timestamp;
}
