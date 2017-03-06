package com.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataloaderRunner implements CommandLineRunner {
	
	@Autowired
	private final EmployeRepository repository;
	
	public DataloaderRunner(EmployeRepository repository) {
		// TODO Auto-generated constructor stub
		this.repository = repository;
	}
	
	
	@Override
	public void run(String... arg0) throws Exception {
		// TODO Auto-generated method stub
		this.repository.save(new Employee("fir", "st"));
		this.repository.save(new Employee("t", "wo"));
		this.repository.save(new Employee("t", "hree"));
		this.repository.save(new Employee("f", "our"));
	}
	
	
}
