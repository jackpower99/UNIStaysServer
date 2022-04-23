import express from "express";
import Student from "./studentModel";
import asyncHandler from 'express-async-handler';
import passport from '../authenticate';
import multer from "multer";
import { type } from "express/lib/response";
const {
  ObjectId
} = require('mongodb');

const router = express.Router();

router.post('/delete', async (req, res) => {
  try{
    const students = await Student.deleteMany();
    res.status(200).json(students);
  }
  catch(err){
    console.log(err)
  }
});

router.get('/',passport.authenticate("jwt", { session: false }), async(req, res) => {
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

    if (!studentFormData.student_email) {
        res.status(401).json({success: false, msg: 'No Student Data Received'});
        return next();
      }
    else{
      const existingStudent = await Student.findByEmail(studentFormData.student_email);
      if(existingStudent){
        res.status(401).json({success: false, msg: 'Student Already Has Account'});
      }
      else{
        await Student.create(studentFormData).catch(e => {
        console.log(e)
        res.status(401).json({success: false, msg: 'Error creating Account'})
        })
        res.status(201).json({code: 201, msg: 'Successful created new student.'});
      }
    }
  }));

//Get Student Information By ID

router.get("/:email", asyncHandler(async (req, res, next) =>{
  const studentEmail = req.params.email;
  console.log(studentEmail)
  console.log(studentEmail)
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(studentEmail);
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

  const studentEmail = req.params.student_email;
  const friend = req.body.friends_id;

  console.log(1, friend)

 
  if(!studentEmail){
    res.status(401).json({success: false, msg: 'No student email Data Received'});
    return next();
  }
  else{
    const existingStudent = await Student.findByEmail(studentEmail);

    console.log(existingStudent.fname)

    if(!existingStudent){
      res.status(401).json({success: false, msg: 'No Student with this email exists'});
    }
    if(!friend){
      res.status(401).json({success: false, msg: 'This friend does not exist'});
    }
    else{
      await Student.updateOne(
        {student_email: studentEmail},
        {$push: {"friends": {
          _id: friend } }
        }
        );
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
    if(!friends){
      res.status(401).json({success: false, msg: 'No friends'});
    }
    else{
      const studentIDs = friends.map(ObjectId);
      console.log(studentIDs)
      const studentsData = await Student.find({
         _id: {$in : studentIDs }
      })
      if(!studentsData){
        res.status(401).json({success: false, msg: 'No friends data'});
      }
      else{
    res.status(200).json({success: true, studentsData});
      }
    }
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

router.post('/:student_email/profile-picture', upload.any("documents"),passport.authenticate("jwt", { session: false }), asyncHandler (async (req, res, next) => {
  const studentEmail = req.params.student_email;

  const files = req.files;

  var documents = files.map(f => ({
    type : f.mimetype,
    name : f.originalname,
    data : f.buffer
  }));
  
  var studentFormData = req.body;
  studentFormData.documents = documents;

  const profilePicture = studentFormData.documents[0]
  
      if (!profilePicture) {
          res.status(401).json({success: false, msg: 'No Picture Data Received'});
          return next();
        }
      else{
          await Student.updateOne(
          {student_email: studentEmail},
          {$set : { profile_picture: {
            type: profilePicture.type, 
            name: profilePicture.name, 
            data: profilePicture.data }
        }
      },function (err,docs){
        if(err){
          console.log(err)
        }
      }
          );
        res.status(201).json({code: 201, msg: 'Successful added profile picture for student.'});
      }
    }));

export default router;