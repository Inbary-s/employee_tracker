DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

USE employeesDB;

drop table department ;
CREATE TABLE department (
id INT auto_increment,
name VARCHAR(30),
primary key (id)
);

drop table roles ;
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
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- CREATE TABLE managers (
-- 	id INT,
--     first_name VARCHAR (30),
--     last_name VARCHAR (30),
--     foreign key(first_name) references employees(first_name),
--     foreign key(last_name) references employees(last_name),
--     foreign key(id) references employees(id)
-- );
-- INSERT INTO managers (id) VALUES (6);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Alex", "Pook", 3, 6);
SELECT * FROM department;
SELECT * FROM roles;
-- SELECT * FROM managers;
SELECT * FROM employees;