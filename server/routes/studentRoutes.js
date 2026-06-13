const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Student Registration
router.post("/register", (req, res) => {

const {
    full_name,
    email,
    phone,
    student_class,
    password
} = req.body;

const sql = `
INSERT INTO students
(full_name,email,phone,student_class,password)
VALUES (?,?,?,?,?)
`;

db.query(
    sql,
    [
        full_name,
        email,
        phone,
        student_class,
        password
    ],
    (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            success: true,
            message: "Student Registered Successfully"
        });

    }
);

});

// Student Login
router.post("/login", (req, res) => {

const { email, password } = req.body;

const sql =
"SELECT * FROM students WHERE email=? AND password=?";

db.query(
    sql,
    [email, password],
    (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {

            res.json({
                success: true,
                message: "Login Successful"
            });

        } else {

            res.json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

    }
);

});

// Add Attendance
router.post("/attendance", (req, res) => {

const {
    student_id,
    attendance_date,
    status
} = req.body;

const sql =
"INSERT INTO attendance (student_id, attendance_date, status) VALUES (?,?,?)";

db.query(
    sql,
    [
        student_id,
        attendance_date,
        status
    ],
    (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            success: true,
            message: "Attendance Saved Successfully"
        });

    }
);

});

module.exports = router;
