import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: String,
    red: Number,
    green: Number,
    yellow: Number,
    price: Number
  },
  {
    versionKey: false
  }
);

const Package = mongoose.model('Package', packageSchema);
export default Package;
