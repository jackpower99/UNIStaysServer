import express from "express";
import Landlord from "./landlordModel";
import asyncHandler from 'express-async-handler';
import passport from '../authenticate';
import multer from "multer";
import { type } from "express/lib/response";
import { route } from "express/lib/application";

const router = express.Router();

router.get('/',passport.authenticate("jwt", { session: false }), async(req, res) => {
    const landlords = await Landlord.find();
    res.status(200).json(landlords);
});

router.post('/delete', async (req, res) => {
  try{
    const landlords = await Landlord.deleteMany();
    res.status(200).json(landlords);
  }
  catch(err){
    console.log(err)
  }
});

const upload = multer();

router.post('/', upload.any("documents"),asyncHandler (async (req, res, next) => {
  
    const files = req.files;
    
    var documents = files.map(f => ({
      type : f.mimetype,
      name : f.originalname,
      data : f.buffer
    }));
    
    var landlordFormData = req.body;
    landlordFormData.documents = documents;
    
        if (!req.body.email) {
            res.status(401).json({success: false, msg: 'No Landlord Data Received'});
            return next();
          }
        else{
          const existingLandlord = await Landlord.findByEmail(req.body.email);
          if(existingLandlord){
            res.status(401).json({success: false, msg: 'Landlord Already Has Account'});
          }
          else{
            await Landlord.create(landlordFormData).catch(e => {console.log(e)})
            res.status(201).json({code: 201, msg: 'Successful created new landlord.'});
          }
        }
      }
    )
);


router.get("/:email",passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{
    const email = req.params.email;
    if(!email){
      res.status(401).json({success: false, msg: 'No landlord email data received'});
      return next();
    }
    else{
      const existingLandlord = await Landlord.findByEmail(req.params.email);
      if(!existingLandlord){
        res.status(401).json({success: false, msg: 'No landlord with this email exists'});
      }
      res.status(200).json({success: true, existingLandlord});
    }
  }));


  router.post('/:email/profile-picture', upload.any("documents"),passport.authenticate("jwt", { session: false }), asyncHandler (async (req, res, next) => {
    const email = req.params.email;
  
    const files = req.files;
  
    var documents = files.map(f => ({
      type : f.mimetype,
      name : f.originalname,
      data : f.buffer
    }));
    
    var landlordFormData = req.body;
    landlordFormData.documents = documents;
  
    const profilePicture = landlordFormData.documents[0]
    
        if (!profilePicture) {
            res.status(401).json({success: false, msg: 'No Picture Data Received'});
            return next();
          }
        else{
            await Landlord.updateOne(
            {email: email},
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
          res.status(201).json({code: 201, msg: 'Successful added profile picture for landlord.'});
        }
      }));

export default router;