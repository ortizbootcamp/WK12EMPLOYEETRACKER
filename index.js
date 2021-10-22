require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

//connect to db

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PW,
    database: "employeetracker_db"
});

//inq part
function beginPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome! Choose an option from below to manage your business.",
            name: "options",
            choices: [
                "Add New Employee",
                "Add New Role",
                "Add New Department",
                "View All Employees",
                "View All Employees by Role",
                "View All Employees by Department",
                "Update Current Employee"
            ]
        }
    ]).then(function (action) {
            switch (action.options) {
                case "Add New Employee":
                    addEmployee();
                break;

                case "Add New Role":
                    addRole();
                break;

                case "Add New Department":
                    addDepartment();
                break;

                case "View All Employees":
                    viewEmployees();
                break;

                case "View All Employees by Role":
                    viewByRole();
                break;

                case "View All Employees by Department":
                    viewByDepartment();
                break;

                case "Update Current Employee":
                    updateEmployee();
                break;
            }
    })

}

//functions
function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Input employee's first name:"
        },
        {
            name: "lastName",
            type: "input",
            message: "Input employee's last name:"
        },
        {
            name: "role",
            type: "input",
            message: "Input employee's role:",
            choices: roleInput()
          },
          {
            name: "minput",
            type: "input",
            message: "Input employee manager's name:",
            choices: managerInput()
        }
            ]) .then(function (addEmAction) {
            var roleId = roleInput().indexOf(addEmAction.role) + 1
            var managerId = managerInput().indexOf(addEmAction.minput) + 1

            connection.query("INSERT INTO employee SET ?", {

                first_name: addEmAction.firstName,
                last_name: addEmAction.lastName,
                manager_id: managerId,
                role_id: roleId
            }, function (err) {
                if (err) throw err
                console.table(addEmAction)
                beginPrompt();
            })
        })
}

function addRole() {
    connection.query("SELECT role.roleName AS RoleName, role.salary AS Salary FROM role", function(err, res) {
        inquirer.prompt([
            {
                name: "RoleName",
                type: "input",
                message: "Input name of role to add:"
            },
            {
                name: "Salary",
                type: "input",
                message: "Input the salary of the role:"
            }
        ]) .then(function (res) {
            connection.query("INSERT INTO role SET ?",
            {
                rolename: res.RoleName,
                salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                beginPrompt();
            })
        });
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "dname",
            type: "input",
            message: "Input name of department to add:"
        }
    ]) .then(function(res) {
        connection.query("INSERT INTO department SET ?",
        {
            name: res.dname
        },
        function(err){
            if (err) throw err
            console.table(res);
            beginPrompt();
        })
    })
}

function viewEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.rolename, role.salary, department.dname, CONCAT(emp.first_name, ' ' , emp.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee emp on employee.manager_id = emp.id;",
    function(err, res) {
        if (err) throw err
        console.table(res)
        beginPrompt();
    })
} 

function viewByRole() {
    connection.query("SELECT employee.first_name, employee.last_name, role.rolename AS roleName FROM employee JOIN role ON employee.role_id = role.id;", //remember this too
    function(err, res) {
        if (err) throw err
        console.table(res)
        beginPrompt();
    })
}

function viewByDepartment() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", //remember this again
    function(err, res) {
        if (err) throw err
        console.table(res)
        beginPrompt();
    })
}

//sub-function?? for add functions
var roles = [];

function roleInput() {
    connection.query("SELECT * FROM role", function(err,res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roles.push(res[i].roleName);
        }
    })
    return roles;
}

var managers = [];

function managerInput() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err,res) {
       if (err) throw err
       for (var i = 0; i < res.length; i++) {
           managers.push(res[i].firstname);
       }
    })
    return managers;
}

//update

function updateEmployee() {
    connection.query("", function (err, res) {
        if (err) throw err
        console.log(res)
    inquirer.prompt([
        {
            name: "lastName",
            type: "list",
            choices: function() {
                var lastName = [];
                for (var i = 0; i < res.length; i++) {
                    lastName.push(res[i].last_name);
                }
                return lastName;
            },
            message: "Input the last name of your desired employee:",
            },
            {
            name: "role",
            type: "list",
            message: "Input the employee's new role:",
            choices: roleInput()
            },
        ]) .then (function(updateAction){
            var roleId = roleInput().indexOf(updateAction.role) + 1
            connection.query("UPDATE employee SET WHERE ?", {
                last_name: updateAction.lastName
            },
            {
                role_id: roleId
            },
            function(err) {
                if (err) throw err
                console.table(updateAction)
                beginPrompt();
            })
        });
    });
}

beginPrompt();