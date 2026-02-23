package com.rkt.dms.service;

import java.util.List;

import com.rkt.dms.dto.NextNumberDto;

public interface NextNumberService {

	public List<NextNumberDto> getNextNumbers();
    public List<NextNumberDto> getNNbyid(String docId , Long id,Long getById);
    public String updateIndex(Long id);
    public NextNumberDto addNewNN(NextNumberDto params);
    public NextNumberDto updateNN(NextNumberDto params, Long id);
    public String deleteNN(Long id);


}
