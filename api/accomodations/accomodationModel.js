import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AccomodationSchema = new Schema({
    id: {type: Number, unique: true, required: true },
    landlord_id: { type: Number, required: true },
    address: { type: String, required: true },
    college: { type: String },
    size_sq_meters: { type: String},
    description:{ type: String },
    bedroom_count: { type : Number },
    bathroom_count: { type: Number },
    property_type: { type: String },
    rooms : { 
        room_id: { type: Number, unique: true, required: true },
        room_type: { type: String },
        size_sq_meters: { type: String },
        agreement_type: [{ type: Schema.Types.ObjectId, ref: 'Agreement' }],
    },
    bookings: {
        booking_id: { type: Number, unique: true, required: true },
        landlord_id: { type: Schema.Types.ObjectId, ref: 'Landlord' },
        student_id:{ type: Schema.Types.ObjectId, ref: 'Student' },
        room_id: { type: Number },
        agreement_type: { type: Schema.Types.ObjectId, ref: 'Agreement' },
        start_date: { type : Date },
        end_date: { type : Date },
        flexi_day_start: { type : String },
        flexi_day_end: { type : String },
    },
    reviews: {
        review_id: { type: Number, unique: true, required: true },
        student_id:{ type: Schema.Types.ObjectId, ref: 'Student' },
        rating: { type: Number },
        summary: { type: String },
        date: { type: String }
    },
    // property_images: {
    //     type: ImageSchema
    // },
    amenities:[{
        name: { type: String }
    }]
});

// const RoomSchema = new Schema({
//     room_id: { type: Number, unique: true, required: true },
//     room_type: { type: String },
//     size_sq_meters: { type: String },
//     agreement_type: { 
//         type: AgreementSchema
//     }
// });

// const BookingSchema = new Schema({
//     booking_id: { type: Number, unique: true, required: true },
//     landlord_id: { type: Number, required: true },
//     student_id: { type: Number, required : true },
//     room_id: { type: Number },
//     agreement_type: { type: Schema.Types.ObjectId, ref: 'Agreement' },
//     start_date: { type : Date },
//     end_date: { type : Date },
//     flexi_day_start: { type : String },
//     flexi_day_end: { type : String },
// });

// const ReviewSchema = new Schema({
//     review_id: { type: Number, unique: true, required: true },
//     student_id: { type: Number, required : true },
//     rating: { type: Number },
//     summary: { type: String },
//     date: { type: String }
// });

// const ImageSchema = new Schema({
//     image_id: { type: Number },
//     room_id: { type: Number },
//     image: { type: Buffer } 
// });



export default mongoose.model('Accomodation', AccomodationSchema);