import express from "express";
import Student from "./studentModel";
import asyncHandler from 'express-async-handler';
import passport from '../authenticate';
import multer from "multer";
import { type } from "express/lib/response";

const router = express.Router();

router.get('/', async(req, res) => {
    const students = await Student.find();
    res.status(200).json(students);
});

const upload = multer();

router.post('/', upload.any("documents"), asyncHandler (async (req, res, next) => {

const files = req.files;

var documents = files.map(f => ({
  type : f.mimetype,
  name : f.originalname,
  data : f.buffer
}));

var studentFormData = req.body;
studentFormData.documents = documents;

    if (!req.body.email) {
        res.status(401).json({success: false, msg: 'No Student Data Received'});
        return next();
      }
    else{
      const existingStudent = await Student.findByEmail(req.body.email);
      if(existingStudent){
        res.status(401).json({success: false, msg: 'Student Already Has Account'});
      }
      else{
        await Student.create(studentFormData).catch(e => {console.log(e)})
        res.status(201).json({code: 201, msg: 'Successful created new student.'});
      }
    }
  }));

//Get Student Information By ID

router.get("/:email",passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.email;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(req.params.email);
    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }

    res.status(200).json({success: true, existingStudent});
  }
}));


router.post("/:student_email/reviews", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.email;
  const studentReview = req.body;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(req.params.email);

    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    if(!studentReview){
      res.status(401).json({success: false, msg: 'No review data Received'});
      return next();
    }
    else{
      await Student.updateOne(
        {email: studentEmail},
        {$push: {reviews: studentReview} }
        );
      res.status(201).json({code: 201, msg: 'Successful added review to student.'});
    }
  }
}));

router.get("/:student_email/reviews", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.email;
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
  const studentEmail = req.params.email;
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
  const studentEmail = req.params.email;
  const document = req.body;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(req.params.email);

    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    if(!document){
      res.status(401).json({success: false, msg: 'No document data Received'});
      return next();
    }
    else{
      await Student.updateOne(
        {email: studentEmail},
        {$push: {documents: document} }
        );
      res.status(201).json({code: 201, msg: 'Successful added document to student.'});
    }
  }
}));

router.get("/:student_email/documents", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.email;
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

router.delete("/:student_email/documents/:id", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.email;
  const documentId = req.params.id;

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
      const returned = await Student.removeStudentDocument(studentEmail, documentId);
      if(returned.modifiedCount !== 1){
        res.status(401).json({success: false, msg: "Failed to remove document"});
      }
      res.status(200).json({success: true, msg: "Successfully removed document"});
    }
  }
}));

router.post("/:student_email/friends", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.email;
  const friend = req.body;
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(req.params.email);

    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    if(!friend){
      res.status(401).json({success: false, msg: 'This friend does not exist'});
    }
    else{
      await Student.updateOne(
        {email: studentEmail},
        {$push: {friends: friend} }
        );
      res.status(201).json({code: 201, msg: 'Successful added friend to student.'});
    }
  }
}));

router.get("/:student_email/friends", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.email;
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

router.delete("/:student_email/friends/:id", passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.email;
  const friendId = req.params.id;

  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email data received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(studentEmail);
    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No student with this email exists'});
    }
    else{
      const returned = await Student.removeStudentFriend(studentEmail, friendId);
      if(returned.modifiedCount !== 1){
        res.status(200).json({success: true, msg: "Successfully removed friend"});
      }
      res.status(401).json({success: false, msg: "Failed to remove review"});
    }
  }
}));



export default router;