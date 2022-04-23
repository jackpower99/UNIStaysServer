import express from "express";
import asyncHandler from 'express-async-handler';
import passport from '../authenticate';
import multer from "multer";
import { type } from "express/lib/response";

const stripe = require('stripe')('sk_test_51KnnugFPMVPrZChF71nLoJoyBx8XlVcfhZs733HB1KGjqx3BHjwSg5ua7xxLn2VtKe4upccD7L7pqkQAmasT5Ak200C6WCW9ox')

const router = express.Router();

router.post('/',passport.authenticate("jwt", { session: false }), async(req, res) => {
    let {amount, id} = req.body;

    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: 'eur',
            payment_method: id,
            confirm: true
        })
        console.log(payment)
        res.status(201).json({code: 201, msg: 'Payment Successful.', success: true});
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: 'Payment Failed',
            success: false
        });
    }

});


export default router;