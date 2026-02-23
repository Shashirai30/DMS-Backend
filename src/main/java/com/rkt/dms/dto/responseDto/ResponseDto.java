package com.rkt.dms.dto.responseDto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDto {
    private Boolean error;
    private Integer status;
    private String message;
    private Object data;
}
