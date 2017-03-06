package com.example;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class Employee {
	@Id
	@GeneratedValue
	private long id;
	
	private String firstName;
	private String lastName;

	
	private Employee() {};
	public Employee(String firstName, String lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
	};
	
}
