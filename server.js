const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Bb>T00t@6",
  database: "employeesDB"
});

let prompts = {
    department:{
        message:"what's the department name?",
        type: 'input',
        name: 'name'
    },
    roles: [{
        message:"what's the role name?",
        type: 'input',
        name: 'name'
    },{
        message:"what's the salary?",
        type: 'input',
        name: 'salary'
    },{
        message:"what's the role's department id?",
        type: 'input',
        name: 'department_id'
    }

    ]
}

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");

});

inquirer.prompt([
    {
        message: "Add, View, Update, or Delete",
        type: "list",
        name: "action",
        choices: ['Add', 'View', 'Update', 'Delete']
    }
    ,{
        message: "Departments, Roles, or Employees",
        type: "list",
        name: "target",
        choices: ['department', 'roles', 'employees']
    }
    //     message: "Delete departments, roles, and employees",
    //     type:"list",
    //     name: "delete"
    //     message: "Update department, roles, and employees",
    //     type: "list",
    //     name: "update"
    // 

]).then(res=>{
    if(res.action === 'Add'){
        inquirer.prompt(prompts[res.target]).then(answer=>{

            // connection.query(`INSERT INTO ${res.target} `)
        })
    }
   
})