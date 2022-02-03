import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AgreementSchema = new Schema({
    id: {type: Number, unique: true, required: true },
    name: { type: String, required: true },
    price_type: { type: String, required: true },
    price: { type: Schema.Types.Decimal128 }
});

export default mongoose.model('Agreement', AgreementSchema);