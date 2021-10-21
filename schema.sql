DROP DATABASE IF EXISTS employeetracker_db
CREATE DATABASE employeetracker_db
USE employeetracker_db

--emp table
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    manager_id INT,
    role_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    FOREIGN KEY (role_id) REFERENCES roleId 
);

--dep table

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dname VARCHAR(50)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    roleName VARCHAR(50),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

--dep seeds
INSERT INTO department (dname)
VALUE ("DEP1");
INSERT INTO department (dname)
VALUE ("DEP2");
INSERT INTO department (dname)
VALUE ("DEP3");
INSERT INTO department (dname)
VALUE ("DEP4");
INSERT INTO department (dname)
VALUE ("DEP5");

--role seeds
INSERT INTO role (roleName, salary, department_id)
VALUE ("R1", 100000, 4);
INSERT INTO role (roleName, salary, department_id)
VALUE ("R2", 100000, 2);
INSERT INTO role (roleName, salary, department_id)
VALUE ("R3", 100000, 1);
INSERT INTO role (roleName, salary, department_id)
VALUE ("R4", 100000, 5);
INSERT INTO role (roleName, salary, department_id)
VALUE ("R5", 100000, 3);

--emp seeds
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("coolguy", "guycool", null, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("kyojuro", "rengoku", 1, 5);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("luka", "leveret", 3, 7);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("new", "dude", null, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("stitch", "alien", 2, 5);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;