const mysql = require("mysql");
const inquirer = require("inquirer");
const express = require("express");
const cTable = require('console.table');
// const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Bb>T00t@6",
  database: "employeesDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
  });

const start = () => {
    inquirer.prompt({
            message: "What would you like to do?",
            type: "list",
            choices: [
                'View all employees', 
                'View employees by department', 
                // 'View employees by manger', 
                'Add a new employee', 
                // 'Add a new role', 
                // 'Add a new department', 
                // 'Update employee roles', 
                // 'Update employee manager', 
                // 'Delete departments', 
                // 'Delete roles', 
                // 'Delete employees', 
                // 'View the total utilized budget of a department',
                'Exit'],
            name: "action"
        }
        ).then(res => {
            console.log(res.action);
        switch (res.action) {
            case 'View all employees':
                employees();
                // start();
            case 'View employees by department':
                employeesByDepartment();
                // start();
            // case 'View employees by manger':
            //     employeesByManager();
            case 'Add a new employee':
                addNewEmployee();
            // case 'Add a new role':
            //     newprompt(prompts.addRole); 
            // case 'Add a new department':
            //     newprompt(prompts.addDepartment); 
            // case 'Update employee roles':
            //     newprompt(prompts.updateRoles)
            // case 'Update employee manager':
            //     newprompt(prompts.updateManager);
            // case 'Delete departments':
            //     deleteDepartment();
            // case 'Delete roles':
            //     eleteRoles();
            // case 'Delete employees': 
            //     deleteEmployees();
            // case 'View the total utilized budget of a department':
            //     viewDeptUtilBudget();
            case 'Exit':
                connection.end();   
            }
        }).catch(err=>console.log(err));
    }

    const addNewEmployee = () => {
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
                connection.query(`SELECT DISTINCT title from roles`, function(err, data){    
                    for (let i = 0; i < data.length; i++){
                    roleArr.push(data[i].title);
                }
                console.log(roleArr);
                return roleArr;
            })
        },
        },{
            message: "Who is this employee's Manager?",
            type: "list", 
            name: 'manager_id',
            choices: function(){
                let managerArr = [];
                connection.query(`SELECT CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees INNER JOIN employees m ON employees.manager_id = m.id`, function(err, data){    
                    for (let i = 0; i < data.length; i++){
                    managerArr.push(data[i].title);
                }
                console.log(managerArr);
                return managerArr;
            });
            }
        },{
            message: "Is this employee a Manager?",
            type: "confirm", 
            name: 'is_manager'
        }]).then(answer => {
            connection.query(`INSERT INTO employees(${answer.first_name}, ${answer.last_name}, ${answer.role_id}, ${answer.manager_id}, ${answer.is_manager})`, function(err, res){
                console.log("Success! A new employee Added");
                start();
            });
        });
    }
        
    const employees = () => {
        connection.query('SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, NULL AS Manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id INNER JOIN department ON roles.department_id = department_id WHERE employees.manager_id IS NULL GROUP BY employees.id UNION SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id INNER JOIN department ON roles.department_id = department_id INNER JOIN employees m ON employees.manager_id = m.id GROUP BY employees.id;',
                function(err, res){
                if (err) throw err;
                const table = cTable.getTable(res);
                console.log(`\n${table}`);
                start();  
            });
        }
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
                query = connection.query(`SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees LEFT JOIN roles on employees.role_id = roles.id INNER JOIN employees m ON employees.manager_id = m.id LEFT JOIN department on roles.department_id = department.id WHERE department.name = '?'`,
                [answer],
                function(err, res){
                    console.log(res);
                        if (err) throw err;
                        const table = cTable.getTable(res);
                        console.log(`\n${table}`);
                        start();   
                    });

            })

        })
    }

    // if(res.action === 'Add'){
    //     inquirer.prompt(prompts[res.target]).then(answer=>{
    //         viewDepartments: departments()
    //         // connection.query(`INSERT INTO ${res.target} `)
    //     })
    
    
    // roles()
    // managers()

// const departments =()=>{
//     connection.query("SELECT * FROM department", (err, data) => {
//     if (err) {
//         return res.status(500).end();
//     };
//     res.json(data);
// });
// } 

// let prompts = {
//     }
// //     addRole:[{
// //         message: "What is the role title?",
// //         type: "input",
// //         name: "title"
// //     },{
// //         message: "What is the annual salary?",
// //         type: "input",
// //         name: "last_name"
// //     },{
// //         message: "What is the department id of this role?",
// //         type: "list",
// //         choices:[departments],
// //         name: 'department_id'
// //     }],
// //     addDepartment:{
// //         message: "What is the department name?",
// //         type: "input",
// //         name: "name"

// };  



// const managers = () => {connection.query("SELECT * FROM managers", (err, data) => {
//     data.forEach(datum=>managerArr.push(datum.title))
//     console.log(data)
// });
// }


// let newprompt = (arg)=>{
// inquirer.prompt(arg).then(answer=>{
//     console.log("Done")
// });
// }







// // start();

// app.listen(PORT, function() {
//     // Log (server-side) when our server has started
//     console.log("Server listening on: http://localhost:" + PORT);
//   });
