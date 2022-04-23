import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AccomodationSchema = new Schema({
    landlord_id: { type: Schema.Types.ObjectId, ref: 'Landlord'},
    address:  { type: String },
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
    lat: { type: mongoose.Decimal128 },
    lng: { type: mongoose.Decimal128 },
    UNIFlex_available: { type: Boolean },
    UNIBNB_available: { type: Boolean },
    booked_dates: [{type: Date}],
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
        agreement_type: { type: String },
        start_date: { type : Date },
        end_date: { type : Date },
        flexi_days: [{ type : Number }],
        default: []
    }],
    reviews: [{
        student_id:{ type: Schema.Types.ObjectId, ref: 'Student' },
        student_name: { type: String },
        summary: { type: String },
        date: { type: Date, default: Date.now },
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

AccomodationSchema.statics.findByZIP = function (zip) {
    return this.findOne({ zip: zip });
  };

  AccomodationSchema.statics.findById = function (id) {
    return this.findOne({ _id: id });
  };

  AccomodationSchema.statics.findByLandlordId = function (id) {
    return this.find({ landlord_id: id });
  };

  AccomodationSchema.statics.deleteById = function (id) {
    return this.deleteOne({ _id: id });
  };

export default mongoose.model('Accomodation', AccomodationSchema);