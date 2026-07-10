const express = require("express");

const router = express.Router();

const db = require("../config/db");

const bcrypt = require("bcryptjs");

router.post("/register", async(req,res)=>{

    const {

        full_name,
        email,
        phone,
        student_class,
        password

    } = req.body;

    try{

        db.query(

            "SELECT * FROM students WHERE email=? OR phone=?",

            [email,phone],

            async(err,result)=>{

                if(err){

                    return res.json({

                        success:false,

                        message:"Database Error"

                    });

                }

                if(result.length>0){

                    return res.json({

                        success:false,

                        message:"Email or Phone already exists"

                    });

                }

                const hashPassword = await bcrypt.hash(password,10);

                db.query(

                    "INSERT INTO students(full_name,email,phone,student_class,password) VALUES(?,?,?,?,?)",

                    [

                        full_name,
                        email,
                        phone,
                        student_class,
                        hashPassword

                    ],

                    (err,data)=>{

                        if(err){

                            return res.json({

                                success:false,

                                message:"Registration Failed"

                            });

                        }

                        res.json({

                            success:true,

                            message:"Student Registered Successfully"

                        });

                    }

                );

            }

        );

    }

    catch(error){

        res.json({

            success:false,

            message:"Server Error"

        });

    }

});

module.exports = router;