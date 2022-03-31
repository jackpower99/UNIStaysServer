import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AccomodationSchema = new Schema({
    landlord_id: { type: Schema.Types.ObjectId, ref: 'Landlord'},
    address:  { type: String },
    posting_type: { type: String },
    county: { type: String },
    zip:  { type: String },
    colleges: [{ type: String }],
    size_sq_meters: { type: String},
    description:{ type: String },
    bedroom_count: { type : Number },
    bathroom_count: { type: Number },
    property_type: { type: String },
    available_start: { type: Date },
    available_end: { type: Date },
    price_per_month: { type: Number },
    UNIFlex_available: { type: Boolean },
    UNIBNB_available: { type: Boolean },
    rooms : [{ 
        room_number: { type: Number },
        room_type: { type: String },
        available_start: { type: Date },
        available_end: { type: Date },
        size_sq_meters: { type: String },
        agreement_type: [{
            type: String
        }],
        room_images: [{
            fieldname: { type: String },
            type: { type: String },
            name: { type: String },
            data: { type: Buffer },
            default: []
        }],
        default: []
    }],
    bookings: [{
        landlord_id: { type: Schema.Types.ObjectId, ref: 'Landlord' },
        student_id:{ type: Schema.Types.ObjectId, ref: 'Student' },
        room_id: { type: Number },
        agreement_type: { type: Schema.Types.ObjectId, ref: 'Agreement' },
        start_date: { type : Date },
        end_date: { type : Date },
        flexi_day_start: { type : String },
        flexi_day_end: { type : String },
        default: []
    }],
    reviews: [{
        review_id: { type: Number },
        student_id:{ type: Schema.Types.ObjectId, ref: 'Student' },
        rating: { type: Number },
        summary: { type: String },
        date: { type: String },
        default: []
    }],
    property_images: [{
        type: { type: String },
        name: { type: String },
        data: { type: Buffer },
        default: []
    }],
    amenities:[{ type: String }
    ]
});


export default mongoose.model('Accomodation', AccomodationSchema);