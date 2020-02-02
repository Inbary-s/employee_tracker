const mysql = require("mysql");
const inquirer = require("inquirer");
const express = require("express");
const PORT = 3000;
const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Bb>T00t@6",
  database: "employeesDB"
});
  let roleArr;
  let managerArr;
let prompts = {
    addEmployee:[{
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
        choices: roleArr,
        name: 'role_id'
    },{
        message: "Who is this employee's Manager",
        type: "list", 
        choices: managerArr,
        name: 'manager_id'
    },{
        message: "Is this employee a Manager",
        type: "confirm", 
        name: 'is_manager'
    }]
//     addRole:[{
//         message: "What is the role title?",
//         type: "input",
//         name: "title"
//     },{
//         message: "What is the annual salary?",
//         type: "input",
//         name: "last_name"
//     },{
//         message: "What is the department id of this role?",
//         type: "list",
//         choices:[departments],
//         name: 'department_id'
//     }],
//     addDepartment:{
//         message: "What is the department name?",
//         type: "input",
//         name: "name"

};  
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
  });
const roles = () => {
    connection.query("SELECT * FROM roles", (err, data) => {
    data.forEach(data=>roleArr.push(data.title))
    console.log(data)
});
}


const managers = () => {connection.query("SELECT * FROM managers", (err, data) => {
    data.forEach(datum=>managerArr.push(datum.title))
    console.log(data)
});
}


let newprompt = (arg)=>{
inquirer.prompt(arg).then(answer=>{
    console.log("Done")
});
}

const start = () => {
    // roles();
//   managers();
    inquirer.prompt(
        {
            message: "What would you like to do?",
            type: "list",
            name: "action",
            choices: ['Add a new employee', 'Add a new role', 'Add a new department', 'View all employees', 'View employees by department', 'View employees by manger', 'Update employee roles', 'Update employee manager', 'Delete departments', 'delete roles', 'delete employees', 'View the total utilized budget of a department']
        }
    ).then(res => {
        roles()
        managers()
        console.log(res.action);
        switch (res.action) {
            case 'View all employees':
                console.log("HERE?")
                employees();
    
            case 'Add a new employee':

                newprompt(prompts.addEmployee);

        // if(res.action === 'Add'){
        //     inquirer.prompt(prompts[res.target]).then(answer=>{
        //         viewDepartments: departments()
        //         // connection.query(`INSERT INTO ${res.target} `)
        //     })
        }
    }).catch(err=>console.log(err));
}


const employees = () => {
    console.log("hello")
    connection.query("SELECT * FROM employees", (err, data) => {
        if (err) {
            return data.status(500).end();
        };
        console.log(data);
        start();
    });
  }


const departments =()=>{
    connection.query("SELECT * FROM department", (err, data) => {
    if (err) {
        return res.status(500).end();
    };
    res.json(data);
});
} 





// start();

app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });
