import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import passport from '../authenticate';


const router = express.Router(); // eslint-disable-line

//Todo change password regex to match front end.
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;

// Get all users
router.get('/', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(1)
  try{
    const users = await User.find();
    console.log(users)
    res.status(200).json(users);
  }
  catch(err){
    console.log(err)
  }
});

router.post('/delete', async (req, res) => {
  try{
    const users = await User.deleteMany();
    console.log(users)
    res.status(200).json(users);
  }
  catch(err){
    console.log(err)
  }
});


// Register OR authenticate a user
router.post('/',asyncHandler( async (req, res, next) => {
 
    if (!req.body.email || !req.body.password) {
      res.status(401).json({code: 401, success: false, msg: 'Please pass username and password.'});
      return next();
    }
    if (req.query.action === 'register') {
      const user = await User.findByEmail(req.body.email);
      if(user){
      res.status(401).json({code: 401, success: false, msg: 'User Already Exists'})
      }
      else {
         if(passwordRegex.test(req.body.password)){
         const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
    });
      await User.create(newUser).catch(e => {console.log(e)})
      res.status(201).json({code: 201, success: true, msg: 'Successful created new user.'});
      }
      else{
        res.status(401).json({code:  401, success: false, msg: 'Invalid Password format'})
      }
    } 
  }
  else {
      const user = await User.findByEmail(req.body.email);
        if (!user) return res.status(401).json({ code: 401, success: false, msg: 'Authentication failed. User not found.' });
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            // if user is found and password matches, create a token
            const token = jwt.sign({email: user.email}, process.env.SECRET, {expiresIn: "2d"});
            // return the information including token as JSON
            res.status(200).json({code: 201, success: true, user: user, token: 'BEARER ' + token});
          } else {
            res.status(401).json({code: 401, success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    }));
  
  // Update a user
  router.put('/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'User Updated Sucessfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
});

export default router;