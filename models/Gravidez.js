import mongoose from 'mongoose';

const gravidezSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  semana: { type: Number, required: true },
  peso: { type: Number, required: true },
  comprimento: { type: Number, required: true },
  dataRegistro: { type: String, required: true },
});

const Gravidez = mongoose.model('Gravidez', gravidezSchema);
export default Gravidez;
