require('dotenv').config();

const { response } = require('express');
const { getByID } = require('./repos/UsersRepo');

const express = require('express');
const app = express();
const mongoose = require('mongoose', { useNewUrlParser: true });

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.error("Connected to Database"));

app.use(express.json());
const usersRouter = require("./routes/users")

//let router = express.Router();
//let UsersRepo = require('./repos/UsersRepo');

app.use('/api/', usersRouter);

/*
router.get('/', function (req, res, next) {

    UsersRepo.get(function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "Ok",
            "message": "Users data fetched successfully",
            "data": data
        });
    }, function (error) {
        next(error);
    });
});

router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    UsersRepo.getByID(id, function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "Ok",
            "message": "Users data fetched successfully",
            "data": data
        });
    }, function (error) {
        next(error);
    });
});

//Creating User
router.post('/', function (req, res, next) {
    UsersRepo.insert(req.body, function (data) {
        res.status(201).json({
            "status": 201,
            "statusText": "Create",
            "message": "User created successfully",
            "data": data
        });
    }, function (error) {
        next(error);
    });
});

//Updating User
router.put('/:id', function (req, res, next) {
    UsersRepo.update(req.params.id, req.body, function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "Update",
            "message": "User updated successfully",
            "data": data
        });
    }, function (error) {
        res.status(404).json({
            "status": 404,
            "statusText": error.message,
            "error": error.message
        });
    });
});

//Deleting User
router.delete('/:id', function (req, res, next) {
    UsersRepo.delete(req.params.id, function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "Delete",
            "message": "User(" + req.params.id + ") deleted successfully"
        });
    }, function (error) {
        res.status(404).json({
            "status": 404,
            "statusText": error.message,
            "error": error.message
        });
    });
});
*/
app.listen(5000, function () {
    console.log("Server Started: http://localhost:5000");
});