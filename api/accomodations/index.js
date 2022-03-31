import express from "express";
import Accomodation from "./accomodationModel";
import asyncHandler from 'express-async-handler';
import passport from '../authenticate';
import multer from "multer";
import { type } from "express/lib/response";

const router = express.Router();

router.get('/', async(req, res) => {
    const accomodations = await Accomodation.find();
    res.status(200).json(accomodations);
});

const upload = multer();

router.post('/', upload.any(), asyncHandler (async (req, res, next) => {

const files = req.files;

var prop_images = files.filter(image => image.fieldname == "property_images")

var room_images_temp = files.filter(image => image.fieldname.startsWith("r"))

var room_images = room_images_temp.map(f => ({
    fieldname : f.fieldname,
    type : f.mimetype,
    name : f.originalname,
    data : f.buffer
}));

var property_images = prop_images.map(f => ({  
  type : f.mimetype,
  name : f.originalname,
  data : f.buffer
}));

var accomodationFormData = req.body;

for(var i = 0; i < accomodationFormData.rooms.length; i++){
    accomodationFormData.rooms[i] = JSON.parse(accomodationFormData.rooms[i])
}

accomodationFormData.property_images = property_images;

accomodationFormData.rooms.forEach(room => {
    room.room_images = room_images.filter(img => img.fieldname.charAt(12) == room.room_number-1)
})
console.log(accomodationFormData.rooms[0].room_images[0])

    if (!req.body) {
        res.status(401).json({success: false, msg: 'No Data Received'});
        return next();
      }
    else{
    //     Find by zip to see if existing
    //   const existingStudent = await Student.findByEmail(req.body.email);
    //   if(existingStudent){
    //     res.status(401).json({success: false, msg: 'Student Already Has Account'});
    //   }
    //  else{

        var {colleges, amenities} = accomodationFormData;

        if(colleges != ""){
            colleges = colleges.split(",");
        }
        if(amenities != ""){
            amenities = amenities.split(",");
        }

        accomodationFormData.colleges = colleges
        accomodationFormData.amenities = amenities
        console.log(accomodationFormData)

        await Accomodation.create(accomodationFormData).catch(e => {console.log(e)})
        res.status(201).json({code: 201, msg: 'Successful created new accomodation.'});
      }
  }));

  export default router;