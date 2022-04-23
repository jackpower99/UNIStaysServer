import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LandlordSchema = new Schema({
    email: { type: String, unique: true, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    address: { type: String, required: true },
    date_of_birth: { type: String },
    phone_number:{ type: String },
    profile_picture:{
        type: { type: String },
        name: { type: String },
        data: { type: Buffer }, },
    documents: [{ 
        type: { type: String },
        name: { type: String },
        data: { type: Buffer },
        default: []
    }],
    properties: [{ type: Schema.Types.ObjectId, ref: 'Accomodation' }]
    
});

LandlordSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email });
  };


export default mongoose.model('Landlord', LandlordSchema);