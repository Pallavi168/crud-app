const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
var sql = require('mssql');

var db = {
    server: "pallavi2.database.windows.net", 
    database: "Stopwatch1", 
    user: "azureuser", 
    password: "Pallavirani1", 
    port: 1433,
    options: {
        encrypt: true
    }
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*app.get('/api/get', cors(), async (req, res) => {
    var conn = new sql.ConnectionPool(db);
    conn.connect().then(function () {
        var reqst = new sql.Request(conn);
        reqst.query('Select * from additem').then(function(result) {
            res.send(result.recordset);
            res.send("This is working!")
            conn.close();
        });
    }).catch(function(err) {
        console.log(err);
    });
});

app.post('/api/signup', (req, res) => {
    var {username} = req.body
    var {email} = req.body
    var {password} = req.body

    var conn = new sql.ConnectionPool(db);
    conn.connect().then(function () {
        var reqst = new sql.Request(conn);
        reqst.query(`Insert into Reg (uname, email, pass) values ('${username}','${email}','${password}')`, (result) => {
            console.log(result)
            console.log('Account Created!');
            conn.close();
        });
    }).catch(function(err) {
        console.log(err);
    });
    console.log(username);
    console.log(email);
    console.log(password);
});*/

app.get('/api/singlerow/:taskID', (req, res) => {
    var taskid = req.params.taskID;
    var conn = new sql.ConnectionPool(db);
    conn.connect().then(function () {
        var reqst = new sql.Request(conn);
        var spSelect = `EXEC SelectTaskById @id = '${taskid}'`
        reqst.query(spSelect).then(function(result) {
            res.send(result.recordset);
            /*res.send("This is working!")*/
            conn.close();
        });
    }).catch(function(err) {
        console.log(err);
    });
});

app.get('/api/get', (req, res) => {
    var conn = new sql.ConnectionPool(db);
    conn.connect().then(function () {
        var reqst = new sql.Request(conn);
        var spView = 'EXEC ViewTask'
        reqst.query(spView).then(function(result) {
            res.send(result.recordset);
            /*res.send("This is working!")*/
            conn.close();
        });
    }).catch(function(err) {
        console.log(err);
    });
});

app.post('/api/insert', (req, res) => {
    var {project} = req.body
    var {module} = req.body
    var {task} = req.body
    var {worktype} = req.body
    var conn = new sql.ConnectionPool(db);
    conn.connect().then(function () {
        var reqst = new sql.Request(conn);
        var spInsert = `EXEC Addtask @Project = '${project}', @Module = '${module}', @Task = '${task}', @Worktype = '${worktype}'`
        reqst.query(spInsert, (result) => {
            /*console.log(result)*/
            console.log('Inserted successfully!');
            conn.close();
        });
    }).catch(function(err) {
        console.log(err);
    });
});

app.delete('/api/delete/:taskId', (req, res) => {
    var taskid = req.params.taskId;
    var conn = new sql.ConnectionPool(db);
    conn.connect().then(function () {
        var reqst = new sql.Request(conn);
        var spDelete = `EXEC DeleteTaskByID @id = '${taskid}'`
        reqst.query(spDelete, (result) => {
            /*console.log(result)*/
            console.log('Deleted successfully!');
            conn.close();
        });
    }).catch(function(err) {
        console.log(err);
    });
    /*console.log(task);*/
})

app.put('/api/update/', (req, res) => {
    var taskId = req.body.taskid
    var {project} = req.body
    var {module} = req.body
    var {task} = req.body
    var {worktype} = req.body
    var conn = new sql.ConnectionPool(db);
    conn.connect().then(function () {
        var reqst = new sql.Request(conn);
        var spUpdate = `EXEC UpdateTask @id = ${taskId}, @Project = '${project}', @Module = '${module}', @Task = '${task}', @Worktype = '${worktype}'`
        reqst.query(spUpdate, (result) => {
            /*console.log(result)*/
            console.log('Updated successfully!');
            conn.close();
        });
    }).catch(function(err) {
        console.log(err);
    });
    /*console.log(taskId);
    console.log(project);
    console.log(module);
    console.log(task);
    console.log(worktype);*/
});

app.listen(port, () => {
    console.log(`running on port ${port}`);
});
