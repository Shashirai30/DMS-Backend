package com.rkt.dms.serviceImpl;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rkt.dms.dto.NextNumberDto;
import com.rkt.dms.entity.NextNumberEntity;
import com.rkt.dms.repository.NextNumberRepository;
import com.rkt.dms.service.NextNumberService;

@Service
public class NextNumberServiceImpl implements NextNumberService{
    @Autowired
    private NextNumberRepository nextNumberRepository;

    @Override
    public List<NextNumberDto> getNextNumbers() {
        return nextNumberRepository.findAll().stream().map(this::convertNNEntitytoDTO).collect(Collectors.toList());
    }

    private NextNumberDto convertNNEntitytoDTO(NextNumberEntity nextNumberEntity) {
        NextNumberDto nextNumberDto = new NextNumberDto();
        nextNumberDto.setId(nextNumberEntity.getId());
        nextNumberDto.setFolder(nextNumberEntity.getFolder());
        nextNumberDto.setCategory(nextNumberEntity.getCategory());
        nextNumberDto.setProcess(nextNumberEntity.getProcess());
        nextNumberDto.setYear(nextNumberEntity.getYear());
        nextNumberDto.setCurrentIndex(nextNumberEntity.getCurrentIndex());
        nextNumberDto.setLastNumber(nextNumberEntity.getLastNumber());
        nextNumberDto.setLength(nextNumberEntity.getLength());
        nextNumberDto.setDocNumber(nextNumberEntity.getDocNumber());
        nextNumberDto.setStatus(nextNumberEntity.getStatus());
        nextNumberDto.setDocId(nextNumberEntity.getDocId());

        return nextNumberDto;
    }

    private NextNumberEntity convertDTOtoNNEntity(NextNumberDto nextNumberDto) {
        NextNumberEntity nextNumberEntity = new NextNumberEntity();
        nextNumberEntity.setFolder(nextNumberDto.getFolder());
        nextNumberEntity.setCategory(nextNumberDto.getCategory());
        nextNumberEntity.setProcess(nextNumberDto.getProcess());
        nextNumberEntity.setYear(nextNumberDto.getYear());
        nextNumberEntity.setLength(nextNumberDto.getLength());
        nextNumberEntity.setStatus(nextNumberDto.getStatus());
        nextNumberEntity.setDocId(nextNumberDto.getFolder()+"-"+nextNumberDto.getCategory());
        System.out.println(nextNumberEntity.getCurrentIndex() + nextNumberEntity.getCurrentIndex());
        return nextNumberEntity;
    }

    @Override
    public NextNumberDto addNewNN(NextNumberDto params) {

        NextNumberEntity nextNumberEntity = convertDTOtoNNEntity(params);
        // String Gate_prefix = nextNumberEntity.getProcess() + "/"+nextNumberEntity.getFolder()+"/"+nextNumberEntity.getCategory()+"-";
        String Gate_prefix = nextNumberEntity.getProcess() + "/"+nextNumberEntity.getFolder()+"-";

        nextNumberEntity.setCurrentIndex(0);

        String Gate_id = Integer.toString(nextNumberEntity.getYear());

        int len = nextNumberEntity.getLength() - Gate_id.length();

        Gate_id = Gate_id + String.format("%0" + len + "d", nextNumberEntity.getCurrentIndex());
        // nextNumberEntity.setDocId(nextNumberEntity.getFolder()+"-"+nextNumberEntity.getCategory());
        nextNumberEntity.setDocNumber(Gate_prefix + Gate_id);
        nextNumberEntity.setLastNumber(Gate_prefix + Gate_id);
        nextNumberEntity.setStatus(1);
        nextNumberRepository.save(nextNumberEntity);
        return convertNNEntitytoDTO(nextNumberEntity);
    }

    @Override
    public List<NextNumberDto> getNNbyid(String gateId, Long id, Long getById) {
        if (id != null) {
            NextNumberEntity nextNumberEntity = nextNumberRepository.findById(id).orElse(null);
            // if (nextNumberEntity.getStatus()==1) {
            // nextNumberEntity.setLastNumber(nextNumberEntity.getGateNumber());
            // nextNumberEntity.setCurrentIndex(nextNumberEntity.getCurrentIndex()+1);
            // }

            // if (nextNumberEntity.getStatus()==1) {
            // nextNumberRepository.save(nextNumberEntity);
            // }
            nextNumberEntity.setLastNumber(nextNumberEntity.getDocNumber());
            nextNumberEntity.setCurrentIndex(nextNumberEntity.getCurrentIndex() + 1);
            // String Gate_prefix = nextNumberEntity.getProcess() + "/"+nextNumberEntity.getFolder()+"/"+nextNumberEntity.getCategory()+"-";
            String Gate_prefix = nextNumberEntity.getProcess() + "/"+nextNumberEntity.getFolder()+"-";
            String Gate_id = Integer.toString(nextNumberEntity.getYear());
            int len = nextNumberEntity.getLength() - Gate_id.length();
            Gate_id = Gate_id + String.format("%0" + len + "d", nextNumberEntity.getCurrentIndex());
            nextNumberEntity.setDocNumber(Gate_prefix + Gate_id);
            nextNumberRepository.save(nextNumberEntity);
            // return convertNNEntitytoDTO(nextNumberEntity);
            return (nextNumberEntity != null) ? Collections.singletonList(convertNNEntitytoDTO(nextNumberEntity))
                    : Collections.emptyList();

        } else if (gateId != null) {
            
            List<NextNumberEntity> optionalNextNumberEntity = nextNumberRepository.findBydocId(gateId);

            for (NextNumberEntity nextNumberEntity : optionalNextNumberEntity) {
                if (nextNumberEntity.getStatus() == 1) {
                    nextNumberEntity.setLastNumber(nextNumberEntity.getDocNumber());
                    nextNumberEntity.setCurrentIndex(nextNumberEntity.getCurrentIndex() + 1);

                    // String gatePrefix = nextNumberEntity.getProcess() + "/"+nextNumberEntity.getFolder()+"/"+nextNumberEntity.getCategory()+"-";
                    String gatePrefix = nextNumberEntity.getProcess() + "/"+nextNumberEntity.getFolder()+"-";
                    String gateIdStr = Integer.toString(nextNumberEntity.getYear());
                    int len = nextNumberEntity.getLength() - gateIdStr.length();
                    gateIdStr = gateIdStr + String.format("%0" + len + "d", nextNumberEntity.getCurrentIndex());

                    nextNumberEntity.setDocNumber(gatePrefix + gateIdStr);
                    nextNumberRepository.save(nextNumberEntity);      
                    
                    return Collections.singletonList(convertNNEntitytoDTO(nextNumberEntity));
                }
            }
            RuntimeException e = new RuntimeException("No active status gate found");
            throw e;

        } else if (getById != null) {
            NextNumberEntity nextNumberEntity = nextNumberRepository.findById(getById).orElse(null);
            // return convertNNEntitytoDTO(nextNumberEntity);
            return (nextNumberEntity != null) ? Collections.singletonList(convertNNEntitytoDTO(nextNumberEntity))
                    : Collections.emptyList();
        } else {
            return nextNumberRepository.findAll().stream().map(this::convertNNEntitytoDTO).collect(Collectors.toList());
        }

    }

    @Override
    public NextNumberDto updateNN(NextNumberDto params, Long id) {
        NextNumberEntity existingNN = nextNumberRepository.findById(id).orElse(null);

        NextNumberEntity paramNN = convertDTOtoNNEntity(params);
        existingNN.setFolder(paramNN.getFolder());
        existingNN.setCategory(paramNN.getCategory());
        existingNN.setProcess(paramNN.getProcess());
        existingNN.setYear(paramNN.getYear());
        // existingNN.setCurrentIndex(paramNN.getCurrentIndex());
        // existingNN.setLastNumber(paramNN.getLastNumber());
        existingNN.setLength(paramNN.getLength());
        existingNN.setStatus(paramNN.getStatus());
        existingNN.setDocId(paramNN.getDocId());
        nextNumberRepository.save(existingNN);

        return convertNNEntitytoDTO(existingNN);
    }

    @Override
    public String updateIndex(Long id) {
        NextNumberEntity existingNN = nextNumberRepository.findById(id).orElse(null);
        existingNN.setCurrentIndex(existingNN.getCurrentIndex() + 1);
        nextNumberRepository.save(existingNN);
        return "Index updated!";
    }

    @Override
    public String deleteNN(Long id) {
        nextNumberRepository.deleteById(id);
        return "Next Number has been Deleted";
    }
}
