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
    is_manager BOOLEAN,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO employees (first_name, last_name, role_id, manager_id, is_manager) VALUES ("Alice", "Black", 2, NULL, TRUE);
INSERT INTO employees (first_name, last_name, role_id, manager_id, is_manager) VALUES ("Inbar", "Shucker", 2, 1, FALSE);
SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employees;

SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.id, department.name AS Department 
FROM employees 
LEFT JOIN roles 
ON employees.role_id = roles.id 
LEFT JOIN department 
ON roles.department_id = department_id 
GROUP BY employees.id;

SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, employees.manager_id AS Manager, roles.title, roles.salary, department.name AS Department FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = department_id GROUP BY department_id;

-- full employee detailed view
SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, NULL AS Manager
FROM employees 
LEFT JOIN roles ON employees.role_id = roles.id 
INNER JOIN department ON roles.department_id = department_id WHERE employees.manager_id IS NULL
GROUP BY employees.id
UNION
SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager 
FROM employees 
LEFT JOIN roles ON employees.role_id = roles.id 
INNER JOIN department ON roles.department_id = department_id 
INNER JOIN employees m ON employees.manager_id = m.id
GROUP BY employees.id;

-- by manager
SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager 
FROM employees 
LEFT JOIN roles ON employees.role_id = roles.id 
INNER JOIN department ON roles.department_id = department_id 
INNER JOIN employees m ON employees.manager_id = m.id WHERE CONCAT(m.first_name, " ", m.last_name) IN ('Molly Blue')
GROUP BY employees.id;

-- by department
SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager 
FROM employees 
LEFT JOIN roles ON employees.role_id = roles.id 
INNER JOIN department ON department.name
INNER JOIN employees m ON employees.manager_id = m.id WHERE department.name = 'Sales';

SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees
LEFT JOIN roles on employees.role_id = roles.id
INNER JOIN employees m ON employees.manager_id = m.id
LEFT JOIN department on roles.department_id = department.id WHERE department.id = '4';

SELECT DISTINCT title from roles ;

SELECT r.title, CONCAT(e.first_name, " ", e.last_name) AS Manager FROM (SELECT * FROM roles) AS r, (SELECT * FROM employees) AS e;

SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = department_id INNER JOIN employees m ON employees.manager_id = m.id WHERE department.name = HR;
SELECT DISTINCT name from department;
SELECT CONCAT(first_name, " ", last_name) AS Manager, id FROM employees;
SELECT CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees INNER JOIN employees m ON employees.manager_id = m.id LEFT JOIN roles ON title;