
require("dotenv").config(); 
console.log("Starting Smart Coaching Management System Server...");

const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const path = require("path");
const db = require("./config/db");
const session = require("express-session");
const multer = require("multer");
const studentRoutes = require("./routes/studentRoutes");
const studentAuthRoutes = require("./routes/studentAuthRoutes");
app.use("/api/students", studentRoutes);

/*app.use("/api/student-auth", studentAuthRoutes);*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "ankitcoaching",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, "../public")));

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "public/uploads");

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});

const upload = multer({
    storage: storage
});

function checkLogin(req, res, next){

    if(req.session.user){

        next();

    }else{

        res.redirect("/login");

    }

}

app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {

    res.redirect("/login");

});


app.get("/login", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/login.html"
        )
    );

});

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    console.log("Email:", email);
    console.log("Password:", password);

    db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, result) => {

            console.log("DB Error:", err);
            console.log("Result:", result);

            if (err) {
                return res.json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length > 0) {

                req.session.user = email;

                return res.json({
                    success: true
                });

            }

            return res.json({
                success: false,
                message: "Invalid Email or Password"
            });

        }
    );

});
/*
app.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    db.query(

        "SELECT * FROM users WHERE email=? AND password=?",

        [email, password],

        (err, result) => {

            if(err){

                console.log(err);

                return res.json({
                    success:false
                });

            }

            if(result.length > 0){

                req.session.user = email;

                return res.json({
                    success:true
                });

            }

            res.json({
                success:false,
                message:"Invalid Email or Password"
            });

        }

    );

});
*/
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (
        email === "admin@gmail.com" &&
        password === "123456"
    ) {

        req.session.user = email;

        return res.json({
            success: true
        });

    }

    return res.json({
        success: false,
        message: "Invalid Email or Password"
    });

});


app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});

app.get(
    "/dashboard",
    checkLogin,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../views/dashboard.html"
            )
        );

    }
);

app.get("/attendance", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/attendance.html"
        )
    );

});

app.get("/add-attendance", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/add-attendance.html"
        )
    );

});

app.get("/attendance-data", (req, res) => {

    db.query(

        "SELECT * FROM attendance",

        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    success:false
                });

            }

            res.json(result);

        }

    );

});

app.get("/fees", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/fees.html"
        )
    );

});

app.post("/save-fees", (req, res) => {

    const {
        student_id,
        amount,
        utr
    } = req.body;

    db.query(

        `
        INSERT INTO fees
        (
            student_id,
            amount,
            utr,
            payment_date
        )
        VALUES
        (
            ?,
            ?,
            ?,
            CURDATE()
        )
        `,

        [
            student_id,
            amount,
            utr
        ],

        (err) => {

            if(err){

                console.log(err);

                return res.json({
                    success:false
                });

            }

            res.json({
                success:true,
                message:"Fees Saved Successfully"
            });

        }

    );

});

app.get("/fees-records", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/fees-records.html"
        )
    );

});

app.get("/fees-data", (req, res) => {

    db.query(

        "SELECT * FROM fees",

        (err, result) => {

            if(err){

                console.log(err);

                return res.json([]);

            }

            res.json(result);

        }

    );

});

app.get("/notes", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/notes.html"
        )
    );

});

app.post("/add-note", (req, res) => {

    const {
        title,
        description
    } = req.body;

    db.query(

        "INSERT INTO notes(title,description) VALUES(?,?)",

        [
            title,
            description
        ],

        (err) => {

            if(err){

                return res.json({
                    success:false,
                    message:"Error"
                });

            }

            res.json({
                success:true,
                message:"Note Added"
            });

        }

    );

});

app.get("/notes-data", (req, res) => {

    db.query(

        "SELECT * FROM notes ORDER BY id DESC",

        (err, result) => {

            if(err){

                return res.json([]);

            }

            res.json(result);

        }

    );

});

app.get("/results", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/results.html"
        )
    );

});

app.post("/add-result", (req, res) => {

    const {

        student_id,
        subject,
        marks,
        total_marks

    } = req.body;

    const result_status =
    marks >= (total_marks * 0.33)
    ? "Pass"
    : "Fail";

    db.query(

        `
        INSERT INTO results
        (
            student_id,
            subject,
            marks,
            total_marks,
            result_status
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?
        )
        `,

        [
            student_id,
            subject,
            marks,
            total_marks,
            result_status
        ],

        (err) => {

            if(err){

                console.log(err);

                return res.json({
                    success:false
                });

            }

            res.json({
                success:true,
                message:"Result Saved"
            });

        }

    );

});

app.get("/results-data", (req, res) => {

    db.query(

        "SELECT * FROM results ORDER BY id DESC",

        (err, result) => {

            if(err){

                return res.json([]);

            }

            res.json(result);

        }

    );

});

app.get("/add-student", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/add-student.html"
        )
    );

});

app.post(

    "/save-student",

    upload.single("photo"),

    (req, res) => {

        const {

            name,
            email,
            phone,
            student_class,
            password

        } = req.body;

        const photo = req.file
        ? "/uploads/" + req.file.filename
        : null;

        db.query(

            `
            INSERT INTO students
            (
                name,
                email,
                phone,
                student_class,
                password,
                photo
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )
            `,

            [
                name,
                email,
                phone,
                student_class,
                password,
                photo
            ],

            (err) => {

                if(err){

                    console.log(err);

                    return res.json({
                        success:false,
                        message:"Student Save Failed"
                    });

                }

                res.json({
                    success:true,
                    message:"Student Added Successfully"
                });

            }

        );

    }

);

app.get("/notice-board",(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            "../views/notice-board.html"
        )
    );
});

app.post("/add-notice",(req,res)=>{

    const {title,description}=req.body;

    db.query(
        "INSERT INTO notices(title,description) VALUES(?,?)",
        [title,description],
        (err)=>{

            if(err){
                console.log(err);
                return res.json({success:false});
            }

            res.json({success:true});
        }
    );
});

app.get("/notice-data",(req,res)=>{

    db.query(
        "SELECT * FROM notices ORDER BY id DESC",
        (err,result)=>{

            if(err){
                console.log(err);
                return res.json([]);
            }

            res.json(result);
        }
    );
});
app.get("/student-identity", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/student-identity.html"
        )
    );

});

app.get("/student-identity-view", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/student-identity-view.html"
        )
    );

});

app.get("/students-list", (req, res) => {

    db.query(
        "SELECT * FROM students ORDER BY id DESC",
        (err, result) => {

            if(err){

                console.log(err);
                return res.json([]);

            }

            res.json(result);

        }
    );

});

app.get("/student/:id", (req, res) => {

    db.query(
        "SELECT * FROM students WHERE id=?",
        [req.params.id],
        (err, result) => {

            if(err || result.length === 0){

                return res.json({
                    success:false
                });

            }

            res.json({
                success:true,
                student:result[0]
            });

        }
    );

});


app.get("/id-card", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/id-card.html"
        )
    );

});

/*app.get("/students-list", (req, res) => {

    db.query(
        "SELECT * FROM students ORDER BY id DESC",
        (err, result) => {

            if(err){

                console.log(err);
                return res.json([]);

            }

            res.json(result);

        }
    );

});*/
app.get("/certificate", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/certificate.html"
        )
    );

});

app.get("/certificate-data/:id", (req, res) => {

    db.query(

        "SELECT * FROM students WHERE id=?",

        [req.params.id],

        (err, result) => {

            if(err || result.length === 0){

                return res.json({
                    success:false
                });

            }

            res.json({
                success:true,
                student:result[0]
            });

        }

    );

});

app.get("/search", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../views/search.html"
        )
    );

});



app.get("/register", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../views/register.html")
    );

});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server Running On Port ${PORT}`
    );

});