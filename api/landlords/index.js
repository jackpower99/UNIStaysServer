import express from "express";
import Landlord from "./landlordModel";
import asyncHandler from 'express-async-handler';
import passport from '../authenticate';
import multer from "multer";
import { type } from "express/lib/response";
import { route } from "express/lib/application";

const router = express.Router();

router.get('/', async(req, res) => {
    const landlords = await Landlord.find();
    res.status(200).json(landlords);
});

const upload = multer();

router.post('/', upload.any("documents"), asyncHandler (async (req, res, next) => {
  
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


router.get("/:email", asyncHandler(async (req, res, next) =>{
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

export default router;