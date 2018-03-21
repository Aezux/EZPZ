const mysql = require('mysql');
const async = require("async");
const database = require("./database.json");

var con;

async function connect() {
    con = mysql.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.database
    });

    con.connect(function (err) {
        if (err) throw err;
    });
}

/* Function to select queries from the database */
exports.select = async function(select, table, where, search) {
    connect(); // Connects to the database
    return new Promise((resolve, reject) => {

        /* Checks if you have a "where" statement */
        let sqlWhere;
        if (where === "" || search === "") {
            sqlWhere = "";
        } else {
            sqlWhere = ` WHERE ${where} = "${search}"`;
        }

        /* The query statement */
        let sql = `SELECT ${select} FROM ${table}` + sqlWhere;

        /* Queries the database */
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            con.end((err) => { }); // Closes the database connection
            setTimeout(() => resolve(result), 0); // Returns the result
        });
    });
}

/* Function to insert values into tables */
exports.insert = async function(table, values) {
    connect(); // Connects to the database
    return new Promise((resolve, reject) => {
        /* Insert "values" into "table" */
        con.query(`INSERT INTO ${table} SET ?`, values, (err, res) => {
            if (err) throw err;
        });

        con.end((err) => { }); // Closes the database connection
        setTimeout(() => resolve(true), 0); // Returns true to tell you that it finished successfully
    });
}


/* Function that updates tables */
exports.update = async function(table, row, newValue, where, search) {
    connect(); // Connects to the database
    return new Promise((resolve, reject) => {

        /* Checks if you have a "where" statement */
        let sqlWhere;
        if (where === "" || search === "") {
            sqlWhere = "";
        } else {
            sqlWhere = ` WHERE ${where} = "${search}"`;
        }

        /* The query statement */
        var sql = `UPDATE ${table} SET ${row} = "${newValue}"` + sqlWhere;

        /* Updates the database */
        con.query(sql, function (err, result) {
            if (err) throw err;
        });

        con.end((err) => { }); // Closes the database connection 
        setTimeout(() => resolve(true), 0); // Returns true to tell you that it finished successfully
    });
}


/* Function that deletes tables */
exports.remove = async function(table, where, search) {
    connect(); // Connects to the database
    return new Promise((resolve, reject) => {

        /* Checks if you have a "where" statement */
        let sqlWhere;
        if (where === "" || search === "") {
            sqlWhere = "";
        } else {
            sqlWhere = ` WHERE ${where} = "${search}"`;
        }

        /* The query statement */
        var sql = `DELETE FROM ${table} WHERE ${where} = "${search}"`;

        /* Deletes the table */
        con.query(sql, function (err, result) {
            if (err) throw err;
        });

        con.end((err) => { }); // Closes the database connection 
        setTimeout(() => resolve(true), 0); // Returns true to tell you that it finished successfully
    });
}
