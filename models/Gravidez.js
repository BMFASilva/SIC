import mongoose from 'mongoose';

const GestacaoRegistroSchema = new mongoose.Schema({
    usuarioId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    semana: {
      type: Number,
      required: true,
    },
    peso: {
      type: Number,
      required: true,
    },
    comprimento: {
      type: Number,
      required: true,
    },
    dataRegistro: {
      type: String,
      required: true,
    },
});

const GestacaoRegistro = mongoose.model('GestacaoRegistro', GestacaoRegistroSchema);
export default GestacaoRegistro;
