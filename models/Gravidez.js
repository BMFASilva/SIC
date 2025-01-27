import mongoose from 'mongoose';

const GestacaoRegistroSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId }, 
  gestacaoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gestacao', required: true },  
  semana: { type: Number, required: true }, 
  peso: { type: Number, required: true }, 
  comprimento: { type: Number, required: true },  
  dataRegistro: { type: Date, default: Date.now },  
});

const GestacaoRegistro = mongoose.model('GestacaoRegistro', GestacaoRegistroSchema);
export default GestacaoRegistro;
