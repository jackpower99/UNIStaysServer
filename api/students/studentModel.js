import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    student_email: { type: String, unique: true, required: true },
    fname: { type: String },
    lname: { type: String},
    address: { type: String},
    date_of_birth: { type: String },
    phone_number:{ type: String },
    college:{ type: String },
    year_of_study:{ type:String },
    allow_show_location: { type: Boolean },
    reviews: [{ 
        landlord_id: {type: Schema.Types.ObjectId, ref: 'Landlord'},
        rating: { type: Number },
        summary: { type: String },
        date: { type: String },
        default: []
    }],
    profile_picture:{
        type: { type: String },
        name: { type: String },
        data: { type: Buffer }, 
    },
    documents: [{ 
        type: { type: String },
        name: { type: String },
        data: { type: Buffer },
        default: []
    }],
    friends: [{
        student_id:{ type: Schema.Types.ObjectId, ref: 'Student' },
        default: []
    }],
});

StudentSchema.statics.findByEmail = function (email) {
    return this.findOne({ student_email: email });
  };

StudentSchema.statics.findStudentReviews = function (email){
    return this.findOne({student_email: email}, 'reviews');
}

StudentSchema.statics.findStudentDocuments = function (email){
    return this.findOne({student_email: email}, 'documents');
}

StudentSchema.statics.findStudentFriends = function (email){
    return this.findOne({student_email: email}, 'friends');
}
StudentSchema.statics.removeStudentReview = function (email, id){
    return this.updateOne({student_email: email},
    { $pull: { reviews: {_id : id } } } );
}

StudentSchema.statics.removeStudentDocument = function (email, id){
    return this.updateOne({student_email: email},
    { $pull: { reviews: {_id : id } } } );
}

StudentSchema.statics.removeStudentFriend = function (email, id){
    return this.updateOne({student_email: email},
    { $pull: { reviews: {_id : id } } } );
}

export default mongoose.model('Student', StudentSchema);