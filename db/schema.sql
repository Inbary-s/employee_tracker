DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE department (
id INT auto_increment,
name VARCHAR(30),
primary key (id)
);

CREATE TABLE roles (
id INT auto_increment,
title VARCHAR(30),
salary decimal,
department_id INT,
primary key (id),
foreign key (department_id) references department(id)
);

drop table employees ;
CREATE TABLE employees (
	id INTEGER AUTO_INCREMENT,
    first_name VARCHAR (30),
    last_name VARCHAR (30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(department_id),
    foreign key(manager_id) references employees(id)
);

SELECT * FROM department;
