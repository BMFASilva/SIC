import mongoose from 'mongoose';

const GestacaoSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId },  
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},  
  dataInicio: { type: Date, required: true },  
  dataTerminoPrevisto: { type: Date }, 
});

const Gestacao = mongoose.model('Gestacao', GestacaoSchema);
export default Gestacao;



