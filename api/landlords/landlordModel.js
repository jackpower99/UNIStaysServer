import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LandlordSchema = new Schema({
    id: {type: Number, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    address: { type: String, required: true },
    date_of_birth: { type: String },
    phone_number:{ type: String },
    password:{ type:String },
    //profile_picture:{ type:String },
    documents: { 
        type: DocumentSchema 
    },
    properties: { type: Schema.Types.ObjectId, ref: 'Accomodation' }
});

const DocumentSchema = new Schema({
    document_id: { type: Number, unique: true, required: true },
    type: { type: String },
    binary: { type: Buffer }
});

export default mongoose.model('Landlord', LandlordSchema);