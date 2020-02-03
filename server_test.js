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

  const employeesQuary = `SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, NULL AS Manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id INNER JOIN department ON roles.department_id = department_id WHERE employees.manager_id IS NULL GROUP BY employees.id UNION SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id INNER JOIN department ON roles.department_id = department_id INNER JOIN employees m ON employees.manager_id = m.id GROUP BY employees.id`;

const start = () => {
    inquirer.prompt({
            message: "What would you like to do?",
            type: "list",
            choices: [
                'View all employees', 
                'View employees by department', 
                'View roles',
                // 'View employees by manger', 
                'Add a new employee', 
                'Add a new role', 
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
                break;
            case 'View employees by department':
                employeesByDepartment();
                break;
            case 'View roles':
                viewRoles();
                break;
            // case 'View employees by manger':
            //     employeesByManager();
            case 'Add a new employee':
                addNewEmployee();
                break;
            case 'Add a new role':
                addRole(); 
                break;
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
            console.log(data[0].id);
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
            console.log(res);
            return managerArr;
        }
    },{
        message: "Is this employee a Manager?",
        type: "confirm", 
        name: 'is_manager'
    }]).then(answer => {
        connection.query(`INSERT INTO employees(first_name, last_name, role_id, manager_id, is_manager) VALUES ('${answer.first_name}', '${answer.last_name}', ${answer.role_id[0]}, ${answer.manager_id[0]}, ${answer.is_manager})`, function(err, res){
            console.log(res);
            start();
        });
    });
})
})
}
const addRole = () => {
    connection.query(`SELECT id, name FROM department`, function(err, data){    
        inquirer.prompt([{
        message: "What is the new title?",
        type: "input",
        name: "title"
    },{
        message: "What is the role's salary?",
        type: "input",
        name: "salary"
        // validate: async (input) => {
        //     if (typeof input !== 'number'){
        //         return 'Please provide a valid number!'}
        //     return true;
        // }
    },{
        message: "Which department does this role belong to?",
        type: "list", 
        name: 'department_id',
        choices: function(){
            let dptArr = [];
            for (let i = 0; i < data.length; i++){
                dptArr.push(`${data[i].id}: ${data[i].name}`);
            }
            console.log(data);
            return dptArr;
        }
    }]).then(answer => {
        connection.query(`INSERT INTO roles(title, salary, department_id) VALUES ('${answer.title}', ${answer.salary}, ${answer.department_id[0]})`, function(err, res){
            console.log(res);
            start();
        });
    });
})
}

    const employees = () => {
        connection.query(employeesQuary,
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
                query = connection.query(`SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, roles.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees LEFT JOIN roles on employees.role_id = roles.id INNER JOIN employees m ON employees.manager_id = m.id LEFT JOIN department on roles.department_id = department.id WHERE department.name = ?`,
                [answer.department],
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

const viewRoles = () => {
    connection.query(`SELECT DISTINCT title, id from roles`, function(err, data){
        if (err) throw err;
            const table = cTable.getTable(data);
            console.log(`\n${table}`);
            start(); 
    });
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
