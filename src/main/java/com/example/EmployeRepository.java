package com.example;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface EmployeRepository extends PagingAndSortingRepository<Employee, Long>{

}
