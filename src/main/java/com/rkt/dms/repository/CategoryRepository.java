package com.rkt.dms.repository;

import com.rkt.dms.entity.CategoryEntity;
import com.rkt.dms.service.CategoryDocumentCount;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    @Query(value = """
        SELECT 
            c.name AS category, 
            COALESCE(dc.doc_count, 0) AS count
        FROM 
            categories c
        LEFT JOIN (
            SELECT 
                d.file_category AS file_category, 
                COUNT(*) AS doc_count
            FROM 
                documents d
            GROUP BY 
                d.file_category
        ) dc 
            ON c.name = dc.file_category
        WHERE 
            c.files_id IN :fileIds
        """, nativeQuery = true)
    List<CategoryDocumentCount> getCategoryDocumentCount(@Param("fileIds") List<Long> fileIds);
}
