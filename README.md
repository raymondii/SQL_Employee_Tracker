# SQL_Employee_Tracker
a command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL.


## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Database Setup](#database-setup)
- [Dependencies](#dependencies)
- [License](#license)

## Description

The Employee Tracker is a Node.js command-line application that allows users to manage a company's employee database. It provides options to view all departments, roles, and employees, add new departments, roles, and employees, and update employee roles.

The application uses MySQL as the database, and the database schema includes tables for `department`, `role`, and `employee`.

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:raymondii/SQL_Employee_Tracker.git

   Navigate to the project directory:
    cd employee-tracker

    Install dependencies:
    npm install --save inquirer@^8.0.0
    npm install --save mysql2


## Database Setup
Install MySQL locally.

Create a new MySQL database named employee_tracker.

Run the schema.sql and seeds.sql files to set up the database schema and initial data:

bash
Copy code
mysql -u your_username -p < schema.sql
mysql -u your_username -p < seeds.sql
Replace your_username with your MySQL username.

Update the MySQL connection details in employeeTracker.js:

javascript
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'your_username',
  password: 'your_password',
  database: 'employee_tracker',
});
Replace your_username and your_password with your actual MySQL username and password.

## Dependencies
Inquirer npm install --save inquirer@^8.0.0 https://www.npmjs.com/package/inquirer
mysql2 npm install --save mysql2 https://www.npmjs.com/package/mysql2

## License
This project is licensed under the MIT License - see the LICENSE file for details.