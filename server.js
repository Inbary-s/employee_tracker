const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');


const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Bb>T00t@6",
  database: "employeesDB"
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    start();
  });

  const employeesQuary = `SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, NULL AS Manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id INNER JOIN department ON roles.department_id = department_id WHERE employees.manager_id IS NULL GROUP BY employees.id UNION SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id INNER JOIN department ON roles.department_id = department_id INNER JOIN employees m ON employees.manager_id = m.id GROUP BY employees.id`;

const start = () => {
    inquirer.prompt({
            message: "What would you like to do?",
            type: "list",
            choices: [
                'View all employees', 
                'View employees by department', 
                'View roles',
                'View departments',
                'View employees by manger', 
                'Add a new employee', 
                'Add a new role', 
                'Add a new department', 
                'Update employee roles', 
                'Update employee manager', 
                'Delete departments', 
                'Delete roles', 
                'Delete employees', 
                'View the total utilized budget of a department',
                'Exit'],
            name: "action"
        }
        ).then(res => {
            console.log(res.action);
        switch (res.action) {
            case 'View all employees':
                employees();
                break;
            case 'View employees by department':
                employeesByDepartment();
                break;
            case 'View roles':
                viewRoles();
                break;
            case 'View departments':
                viewDepartments();
                break;
            case 'View employees by manger':
                employeesByManager();
                break;
            case 'Add a new employee':
                addNewEmployee();
                break;
            case 'Add a new role':
                addRole(); 
                break;
            case 'Add a new department':
                addDepartment(); 
                break;
            case 'Update employee roles':
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmpManager();
                break;
            case 'Delete departments':
                deleteDepartment();
                break;
            case 'Delete roles':
                deleteRoles();
                break;
            case 'Delete employees': 
                deleteEmployees();
                break;
            case 'View the total utilized budget of a department':
                viewDeptUtilBudget();
                break;
            case 'Exit':
                connection.end();   
            }
        }).catch(err=>console.log(err));
    };

const addNewEmployee = () => {
    connection.query(`SELECT CONCAT(first_name, " ", last_name) AS Manager, id FROM employees`, function(err, res){
        connection.query(`SELECT DISTINCT title, id from roles`, function(err, data){    
            inquirer.prompt([{
                message: "What is the employee's first name?",
                type: "input",
                name: "first_name"
            },{
                message: "What is the employee's last name?",
                type: "input",
                name: "last_name"
            },{
                message: "What is the employee's role?",
                type: "list",
                name: 'role_id',
                choices: function(){
                    let roleArr = [];
                        for (let i = 0; i < data.length; i++){
                        roleArr.push(`${data[i].id}: ${data[i].title}`);
                    }
                    // console.log(data[0].id);
                    return roleArr;
                }
            },{
                message: "Who will be this employee's Manager?",
                type: "list", 
                name: 'manager_id',
                choices: function(){
                let managerArr = [];
                        for (let i = 0; i < res.length; i++){
                        managerArr.push(`${res[i].id}: ${res[i].Manager}`);
                    }
                    // console.log(res);
                    return managerArr;
                }
            },{
                message: "Is this employee a Manager?",
                type: "confirm", 
                name: 'is_manager'
            }]).then(answer => {
                connection.query(`INSERT INTO employees(first_name, last_name, role_id, manager_id, is_manager) VALUES ('${answer.first_name}', '${answer.last_name}', ${answer.role_id[0]}, ${answer.manager_id[0]}, ${answer.is_manager})`, function(err, res){
                    // console.log(res);
                    start();
                });
            });
        });
    });
};

const addRole = () => {
    connection.query(`SELECT id, name FROM department`, function(err, data){    
        inquirer.prompt([{
        message: "What is the new title?",
        type: "input",
        name: "title"
        },{
        message: "What is the role's salary?",
        type: "input",
        name: "salary",
        validate: (input) => {
            if (!isNaN(input)){
                return true;
            }else{
            return 'Please provide a valid number!'}}
        },{
        message: "Which department does this role belong to?",
        type: "list", 
        name: 'department_id',
        choices: function(){
            let dptArr = [];
            for (let i = 0; i < data.length; i++){
                dptArr.push(`${data[i].id}: ${data[i].name}`);
            }
            // console.log(data);
            return dptArr;
        }
        }]).then(answer => {
            connection.query(`INSERT INTO roles(title, salary, department_id) VALUES ('${answer.title}', ${answer.salary}, ${answer.department_id[0]})`, function(err, res){
                // console.log(res);
                start();
            });
        });
    });
};

const updateEmployeeRole = () =>{
    connection.query(`SELECT CONCAT(first_name, " ", last_name) AS Name, id FROM employees`, function(err, res){
        connection.query(`SELECT DISTINCT title, id from roles`, function(err, data){
        inquirer.prompt([{
            message: "Select employee:",
            type: "list",
            name: "name",
            choices: function(){
                let employeeArr = [];
                for (let i = 0; i < res.length; i++){
                    employeeArr.push(`${res[i].id}: ${res[i].Name}`);
            }
                // console.log(res);
                return employeeArr;
            } 
        },{
            message: "Select role to update",
            type: "list",
            name: "role_id",
            choices: function(){
                let roleArr = [];
                    for (let i = 0; i < data.length; i++){
                    roleArr.push(`${data[i].id}: ${data[i].title}`);
                }
                // console.log(data[0].id);
                return roleArr;
            }
        }]).then(answer => {
            connection.query(`UPDATE employees SET role_id = ${answer.role_id[0]} WHERE id = ${answer.name[0]}`, function(err, res){
                // console.log(res);
                start();
            });
        });   
        });
    });
};

const updateEmpManager = () =>{
    connection.query(`SELECT CONCAT(m.first_name, " ", m.last_name) AS Manager, m.id FROM employees INNER JOIN employees m ON employees.manager_id = m.id`, function(err, data){
        connection.query(`SELECT CONCAT(first_name, " ", last_name) AS Name, id FROM employees`, function(err, res){
            // console.log(data);
            if (err) throw err;
            inquirer.prompt([{
                message: "Select employee:",
                type: "list",
                name: "name",
                choices: function(){
                    let employeeArr = [];
                    for (let i = 0; i < res.length; i++){
                        employeeArr.push(`${res[i].id}: ${res[i].Name}`);
                    }
                    // console.log(res);
                    return employeeArr;
                } 
            },{
                message: "Select Manager:",
                type: "list", 
                name: 'manager_id',
                choices: function(){
                    let managerArr = [];
                    for (let i = 0; i < data.length; i++){
                    managerArr.push(`${data[i].id}: ${data[i].Manager}`);
                }
                // console.log(data.Manager);
                return managerArr;
            }
            }]).then(answer => {
                connection.query(`UPDATE employees SET manager_id = ${answer.manager_id[0]} WHERE id = ${answer.name[0]}`, function(err, res){
                    // console.log(res);
                    start();
                });
            });   
        });
    });
};

const addDepartment = () => {    
        inquirer.prompt([{
        message: "What is the new department name?",
        type: "input",
        name: "name"
    }]).then(answer => {
        connection.query(`INSERT INTO department (name) VALUES ('${answer.name}')`, function(err, res){
            start();
        });
    });
};

const deleteDepartment = () => {
    connection.query(`SELECT DISTINCT name, id from department`, function(err, res) {
        inquirer.prompt([{
            message: "Select a dipartment to delete",
            type: "list",
            name: "department",
            choices: function(){
                let deptArr = [];
                    for (let i = 0; i < res.length; i++){
                    deptArr.push(`${res[i].id}: ${res[i].name}`);
                }
                // console.log(res);
                return deptArr;
            }
        }]).then(answer => {
            connection.query(`DELETE FROM department WHERE id = ${answer.department[0]}`, function(err, res){
                start();
            });
        });
    });
};

const viewDeptUtilBudget = () => {
    connection.query(`SELECT DISTINCT name, id from department`, function(err, res) {
        inquirer.prompt([{
            message: "Select a dipartment to view:",
            type: "list",
            name: "department",
            choices: function(){
                let deptArr = [];
                    for (let i = 0; i < res.length; i++){
                    deptArr.push(`${res[i].id}: ${res[i].name}`);
                }
                // console.log(res);
                return deptArr;
            }
        }]).then(answer => {
            connection.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, roles.department_id AS Department FROM employees   LEFT JOIN roles ON employees.role_id = roles.id INNER JOIN department ON roles.department_id = department_id WHERE department_id = ${answer.department[0]}
            GROUP BY employees.id`, function(err, data){
                if (err) throw err;
                // console.log([data[0].salary]);
                let salaryArr = [];
                const sumArr = () => {
                    for (let i = 0; i < data.length; i++){
                        salaryArr.push(data[i].salary);
                    }
                }
                sumArr();
                // console.log(salaryArr);
                console.log(salaryArr.reduce((a, b) => a + b))
                start();
            });
        })
    });
};

const deleteRoles = () => {
    connection.query(`SELECT DISTINCT title, id from roles`, function(err, res) {
        inquirer.prompt([{
            message: "Select a role to delete",
            type: "list",
            name: "roles_id",
            choices: function(){
                let roleArr = [];
                    for (let i = 0; i < res.length; i++){
                    roleArr.push(`${res[i].id}: ${res[i].title}`);
                }
                // console.log(res);
                return roleArr;
            }
        }]).then(answer => {
            connection.query(`DELETE FROM roles WHERE id = ${answer.roles_id[0]}`, function(err, res){
                start();
            });
        });
    });
};

const deleteEmployees = () => {
    connection.query(`SELECT CONCAT(first_name, " ", last_name) AS Name, id FROM employees`, function(err, res){
        inquirer.prompt([{
            message: "Select employee to delete",
            type: "list",
            name: "Name",
            choices: function(){
                let employeeArr = [];
                    for (let i = 0; i < res.length; i++){
                    employeeArr.push(`${res[i].id}: ${res[i].Name}`);
                }
                // console.log(res);
                return employeeArr;
            }
        }]).then(answer => {
            connection.query(`DELETE FROM employees WHERE id = ${answer.Name[0]}`, function(err, res){
                start();
            });
        });
    });
};

const employees = () => {
    connection.query(employeesQuary,
        function(err, res){
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(`\n${table}`);
        start();  
    });
};

const employeesByDepartment = async () => {
    connection.query(`SELECT DISTINCT name from department`, function(err, res) {
        if (err) throw err;
        inquirer.prompt([{
            name: "department",
            type: "list",
            message: "Select department:",
            choices: function(){
                let deptArr = [];
                for (let i = 0; i < res.length; i++){
                    deptArr.push(res[i].name);
                }
                return deptArr;
            }
        }]).then(answer => {
            query = connection.query(`SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees LEFT JOIN roles on employees.role_id = roles.id INNER JOIN employees m ON employees.manager_id = m.id LEFT JOIN department on roles.department_id = department.id WHERE department.name = ?`,
            [answer.department],
            function(err, res){
                // console.log(res);
                if (err) throw err;
                const table = cTable.getTable(res);
                console.log(`\n${table}`);
                start();   
            });
        });
    });
};

const employeesByManager = async () => {
    connection.query(`SELECT CONCAT(m.first_name, " ", m.last_name) AS Manager, m.id FROM employees INNER JOIN employees m ON employees.manager_id = m.id`, function(err, res){
        if (err) throw err;
        inquirer.prompt({
            message: "Select Manager:",
                type: "list", 
                name: 'manager_id',
                choices: function(){
                let managerArr = [];
                    for (let i = 0; i < res.length; i++){
                    managerArr.push(`${res[i].id}: ${res[i].Manager}`);
                }
                // console.log(res);
                return managerArr;
            }
        }).then(answer => {
            query = connection.query(`SELECT employees.id, CONCAT(first_name, " ", last_name) AS Name, roles.title 
            FROM employees INNER JOIN roles ON employees.role_id = roles.id 
            WHERE employees.manager_id = ${answer.manager_id[0]} GROUP BY employees.id`,
            [answer.department],
            function(err, res){
                // console.log(res);
                if (err) throw err;
                const table = cTable.getTable(res);
                console.log(`\n${table}`);
                start();   
            });
        });
    });
};

const viewRoles = () => {
    connection.query(`SELECT DISTINCT title, id from roles`, function(err, data){
        if (err) throw err;
        const table = cTable.getTable(data);
        console.log(`\n${table}`);
        start(); 
    });
};

const viewDepartments = () => {
    connection.query(`SELECT * FROM department`, function(err, data){
        if (err) throw err;
        const table = cTable.getTable(data);
        console.log(`\n${table}`);
        start(); 
    });
};