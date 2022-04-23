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

router.post('/friends-locations',passport.authenticate("jwt", { session: false }), async(req, res) => {

  const friends_ids = req.body
  const currentDate = new Date();

  if(friends_ids){
  var friendsBookedAccomodations = await Accomodation.find({
    $and:([
      {"bookings.student_id":{ $in: friends_ids}},
      {"bookings.start_date":{$lt: currentDate}},
      {"bookings.end_date":{$gt: currentDate}},
    ])
  }, function(err,docs){

    if(err){
      console.log(err)
      res.status(401).json({success: false, msg: "Error gettings friends bookings for current location."})
    }
    else{
    const friendLocationPropertyIds = [];
    docs.forEach(acc=>{
      friendLocationPropertyIds.push(acc._id)
    })
    res.status(201).json(friendLocationPropertyIds);
  }
  });
}
else{
  res.status(401).json({success: false, msg: "The current user has no friends"});
}
});

router.get('/:id',passport.authenticate("jwt", { session: false }), async(req, res) => {
    const accomodation = await Accomodation.findById(req.params.id);
    res.status(200).json(accomodation);
});

router.get('/student-bookings/:id',passport.authenticate("jwt", { session: false }), async(req, res) => {
  const student_id = req.params.id
  if(!student_id){
    res.status(401).json({success: false, msg: "No student id received"});
  }
  else{
    try {
     Accomodation.find({
      "bookings.student_id": student_id
      }, function (err,accs){
        if(err){
        console.log(err)
        res.status(401).json({success: false});
        }else{
        res.status(200).json(accs);
      }
    }
    ).clone().catch(function(err){ console.log(err)})}
     catch (error) {
    console.log(error)
  }
}
});

router.get('/landlord/:id',passport.authenticate("jwt", { session: false }), async(req, res) => {
  const accomodations = await Accomodation.findByLandlordId(req.params.id);
  res.status(200).json(accomodations);
});

const upload = multer();

router.post('/', upload.any(),passport.authenticate("jwt", { session: false }), asyncHandler (async (req, res, next) => {

const files = req.files;

var prop_images = files.filter(image => image.fieldname == "property_images")

var property_images = prop_images.map(f => ({  
  type : f.mimetype,
  name : f.originalname,
  data : f.buffer
}));

var accomodationFormData = req.body;

accomodationFormData.property_images = property_images;

    if (!req.body) {
        res.status(401).json({success: false, msg: 'No Data Received'});
        return next();
      }
    else{

        var {colleges, amenities} = accomodationFormData;

        if(colleges != ""){
            colleges = colleges.split(",");
        }
        if(amenities != ""){
            amenities = amenities.split(",");
        }

        accomodationFormData.colleges = colleges
        accomodationFormData.amenities = amenities

        await Accomodation.create(accomodationFormData).catch(e => {console.log(e)})
        res.status(201).json({code: 201, msg: 'Successful created new accomodation.'});
      }
  }));

  router.post("/:id",passport.authenticate("jwt", { session: false }), asyncHandler(async (req, res, next) =>{

    if (!req.body) {
        res.status(401).json({success: false, msg: 'No Data Received'});
        return next();
      }
      if (req.query.action === 'delete') {
        try {
          await Accomodation.findByIdAndDelete(req.params.id)
          const accomodations = await Accomodation.find();
          res.status(201).json({code: 201, msg: 'Successful deleted accomodation.', accomodations: accomodations});
        } catch (error) {
          res.status(401).json({success: false, msg: 'Error deleting accomodation'}); 
        }
      }
      else{
            var dates = [];
            const accomodation = await Accomodation.findById(req.params.id);

            const bookedDates = accomodation.booked_dates;
            var datesAsStrings = [];
            
            bookedDates.forEach(d => {
                datesAsStrings = [...datesAsStrings, d.toISOString()]
            })

            req.body.booked_dates.forEach(date => {
            if(datesAsStrings.includes(new Date(date).toISOString())){
                dates=[...dates, date];
            }
            });
            if(dates.length==0){
                await Accomodation.updateOne(
                          {_id: req.params.id},
                          {$push: {
                            booked_dates: req.body.booked_dates,  
                            bookings: req.body
                        } }
                          );
                          res.status(201).json({code: 201, msg: 'Successful booked accomodation.'});
            }
            res.status(401).json({success: false, msg: 'Conflicts', dates: dates});         
      } 
  }));


  router.get('/accomodation-reviews/:id', async(req, res) => {
    const id = req.params.id
    try {
       Accomodation.findOne({
        _id: id
      }, function (err,accs){
        if(err){
          console.log(err)
          res.status(401).json({success: false});
        }else{
          res.status(200).json(accs.reviews);
        }
      }
      ).clone().catch(function(err){ console.log(err)})}
       catch (error) {
      console.log(error)
    }
  });

  router.post('/accomodation-reviews/:id',passport.authenticate("jwt", { session: false }), async(req, res) => {
    const id = req.params.id
    const body = req.body

    try {
      const updated = await Accomodation.updateOne(
        {_id: id},
        {$push : { reviews: {
          student_id: body.student_id, 
          student_name: body.student_name, 
          summary: body.review
        }
        }
      })
      //(function(err){ console.log(err)})
      res.status(201).json({success:true, data: updated });
    }

      catch (error) {
        res.status(401).json({success: false, msg:"error adding review to accomodation"});
     console.log(error)
  } 
  });

  export default router;