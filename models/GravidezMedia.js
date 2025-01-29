import mongoose from 'mongoose';

const gravidezMediaSchema = new mongoose.Schema({
  semana: { type: Number, required: true },
  peso: { type: Number, required: true },
  comprimento: { type: Number, required: true },
  facto: { type: String, required: true }
});

const GravidezMedia = mongoose.model('GravidezMedia', gravidezMediaSchema);
export default GravidezMedia;
