import express from "express";
import Student from "./studentModel";
import asyncHandler from 'express-async-handler';
import passport from '../authenticate';

const router = express.Router();

router.get('/', async(req, res) => {
    const students = await Student.find();
    res.status(200).json(students);
});

router.post('/', asyncHandler (async (req, res, next) => {

    if (!req.body.student_email) {
        res.status(401).json({success: false, msg: 'No Student Data Received'});
        return next();
      }
    else{
      const existingStudent = await Student.findByEmail(req.body.student_email);
      if(existingStudent){
        res.status(401).json({success: false, msg: 'Student Already Has Account'});
      }
      else{
        await Student.create(req.body).catch(e => {console.log(e)})
        res.status(201).json({code: 201, msg: 'Successful created new student.'});
      }
    }
}));

//Get Student Information By ID

router.get("/:student_email", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.student_email;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(req.params.student_email);
    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }

    res.status(200).json({success: true, existingStudent});
  }
}));

router.post("/:student_email/reviews", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.student_email;
  const studentReview = req.body;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(req.params.student_email);

    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    if(!studentReview){
      res.status(401).json({success: false, msg: 'No review data Received'});
      return next();
    }
    else{
      await Student.updateOne(
        {student_email: studentEmail},
        {$push: {reviews: studentReview} }
        );
      res.status(201).json({code: 201, msg: 'Successful added review to student.'});
    }
  }
}));

router.get("/:student_email/reviews", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.student_email;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(studentEmail);
    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    const {reviews} =  await Student.findStudentReviews(studentEmail);
    res.status(200).json({success: true, reviews});
  }
}));

router.delete("/:student_email/reviews/:id", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.student_email;
  const reviewId = req.params.id;

  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
     const existingStudent = await Student.findByEmail(studentEmail);
    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    else{
      const returned = await Student.removeStudentReview(studentEmail, reviewId);
      if(returned.modifiedCount !== 1){
        res.status(200).json({success: true, msg: "Successfully removed review"});
      }
      res.status(401).json({success: false, msg: "Failed to remove review"});
    }
  }
}));

router.post("/:student_email/documents", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.student_email;
  const document = req.body;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(req.params.student_email);

    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    if(!document){
      res.status(401).json({success: false, msg: 'No document data Received'});
      return next();
    }
    else{
      await Student.updateOne(
        {student_email: studentEmail},
        {$push: {documents: document} }
        );
     // await Student.create(req.body.review).catch(e => {console.log(e)})
      res.status(201).json({code: 201, msg: 'Successful added document to student.'});
    }
  }
}));

router.get("/:student_email/documents", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.student_email;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(studentEmail);
    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    const {documents} =  await Student.findStudentDocuments(studentEmail);
    res.status(200).json({success: true, documents});
  }
}));

router.post("/:student_email/friends", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.student_email;
  const friend = req.body;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(req.params.student_email);

    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    if(!friend){
      res.status(401).json({success: false, msg: 'This friend does not exist'});
    }
    else{
      await Student.updateOne(
        {student_email: studentEmail},
        {$push: {friends: friend} }
        );
     // await Student.create(req.body.review).catch(e => {console.log(e)})
      res.status(201).json({code: 201, msg: 'Successful added friend to student.'});
    }
  }
}));

router.get("/:student_email/friends", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.student_email;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(studentEmail);
    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    const {friends} =  await Student.findStudentFriends(studentEmail);
    res.status(200).json({success: true, friends});
  }
}));




export default router;