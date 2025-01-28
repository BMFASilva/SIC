import mongoose from 'mongoose';

const gestacaoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ultimaMenstruacao: {
    type: String,
    required: true,
  },
  dataTerminoPrevisto: {
    type: Date,
    required: true,
  },
});

const Gestacao = mongoose.model('Gestacao', gestacaoSchema);

export default Gestacao;



