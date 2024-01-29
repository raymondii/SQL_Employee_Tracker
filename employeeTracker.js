const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'user',
  password: '', 
  database: 'employee_tracker',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
  startApp();
});

// Function to display main menu
function startApp() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;

        case 'View all roles':
          viewAllRoles();
          break;

        case 'View all employees':
          viewAllEmployees();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

        case 'Exit':
          connection.end();
          break;

        default:
          break;
      }
    });
}

// Function to view all departments
function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all roles
function viewAllRoles() {
  connection.query(
    'SELECT role.id, title, salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

// Function to view all employees
function viewAllEmployees() {
  connection.query(
    `SELECT e.id, e.first_name, e.last_name, role.title, role.salary, 
            department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager
     FROM employee e
     LEFT JOIN role ON e.role_id = role.id
     LEFT JOIN department ON role.department_id = department.id
     LEFT JOIN employee m ON e.manager_id = m.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      connection.query('INSERT INTO department SET ?', { name: answer.name }, (err) => {
        if (err) throw err;
        console.log('Department added successfully!');
        startApp();
      });
    });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the title of the role:',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for the role:',
        validate: (value) => {
          if (isNaN(value) || value <= 0) {
            return 'Please enter a valid salary';
          }
          return true;
        },
      },
      {
        name: 'department_id',
        type: 'input',
        message: 'Enter the department ID for the role:',
        validate: (value) => {
          if (isNaN(value) || value <= 0) {
            return 'Please enter a valid department ID';
          }
          return true;
        },
      },
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO role SET ?',
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        (err) => {
          if (err) throw err;
          console.log('Role added successfully!');
          startApp();
        }
      );
    });
}

// Function to add an employee
function addEmployee() {
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) throw err;

    connection.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'first_name',
            type: 'input',
            message: 'Enter the first name of the employee:',
          },
          {
            name: 'last_name',
            type: 'input',
            message: 'Enter the last name of the employee:',
          },
          {
            name: 'role_id',
            type: 'list',
            message: 'Select the role for the employee:',
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
          },
          {
            name: 'manager_id',
            type: 'list',
            message: 'Select the manager for the employee:',
            choices: [{ name: 'None', value: null }].concat(
              employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              }))
            ),
          },
        ])
        .then((answer) => {
          connection.query(
            'INSERT INTO employee SET ?',
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role_id,
              manager_id: answer.manager_id,
            },
            (err) => {
              if (err) throw err;
              console.log('Employee added successfully!');
              startApp();
            }
          );
        });
    });
  });
}

// Function to update an employee role
function updateEmployeeRole() {
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err;

    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'employee_id',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: 'role_id',
            type: 'list',
            message: 'Select the new role for the employee:',
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
          },
        ])
        .then((answer) => {
          connection.query(
            'UPDATE employee SET ? WHERE ?',
            [
              {
                role_id: answer.role_id,
              },
              {
                id: answer.employee_id,
              },
            ],
            (err) => {
              if (err) throw err;
              console.log('Employee role updated successfully!');
              startApp();
            }
          );
        });
    });
  });
}
