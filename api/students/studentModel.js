import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    id: {type: Number, unique: true, required: true },
    student_email: { type: String, unique: true, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    address: { type: String, required: true },
    date_of_birth: { type: String },
    phone_number:{ type: String },
    college:{ type: String },
    year_of_study:{ type:String },
    password:{ type:String },
    //profile_picture:{ type:String },
    allow_show_location: { type: Boolean },
    reviews: { 
        type: ReviewSchema
    },
    documents: { 
        type: DocumentSchema 
    },
    freinds: {
        type: FriendsSchema
    }
});

const ReviewSchema = new Schema({
    review_id: { type: Number, unique: true, required: true },
    landlord_id: {type: Number},
    rating: { type: Number },
    summary: { type: String },
    date: { type: String }
});

const DocumentSchema = new Schema({
    document_id: { type: Number, unique: true, required: true },
    type: { type: String },
    binary: { type: Buffer }
});

const FriendsSchema = new Schema({
    friend_id: { type: Number, unique: true, required: true },
    student_id: { type: Number }
});


export default mongoose.model('Student', StudentSchema);