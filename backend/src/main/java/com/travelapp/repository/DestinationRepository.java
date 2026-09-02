package com.travelapp.repository;

import com.travelapp.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {

    @Query("SELECT d FROM Destination d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.country) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Destination> searchByNameOrCountry(@Param("query") String query);

    List<Destination> findByContinentIgnoreCase(String continent);

    List<Destination> findByCategoryIgnoreCase(String category);

    List<Destination> findByContinentIgnoreCaseAndCategoryIgnoreCase(String continent, String category);
}
