import express from "express";
import req from "express/lib/request";
import Student from "./studentModel";
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get('/', async(req, res) => {
    const students = await Student.find();
    res.status(200).json(students);
});

router.post('/', asyncHandler (async (req, res, next) => {

    console.log(req.query.action);

    if (!req.body.student_email || !req.body.password) {
        res.status(401).json({success: false, msg: 'Please pass username and password.'});
        return next();
      }
      if (req.query.action === 'register') {
        //if(passwordRegex.test(req.body.password)){
        await Student.create(req.body);
        res.status(201).json({code: 201, msg: 'Successful created new user.'});
        //}
        // else{
        //   res.status(401).json({code:  401, msg: 'Invalid Password format'})
        // }
      } else {
        // const user = await User.findByUserName(req.body.username);
        //   if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
        //   user.comparePassword(req.body.password, (err, isMatch) => {
        //     if (isMatch && !err) {
        //       // if user is found and password matches, create a token
        //       const token = jwt.sign(user.username, process.env.SECRET);
        //       // return the information including token as JSON
        //       res.status(200).json({success: true, token: 'BEARER ' + token});
        //     } else {
              res.status(401).json({code: 401,msg: 'Authentication failed. Wrong password.'});
            }
         // });
    // await Student(req.body).save();
    // res.status(201).json({
    //     code: 201,
    //     msg: 'Successfully created new student',
    // });
}));

export default router;