import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId },  // ID único
  nome: { type: String, required: true },  // Nome do usuário
  senha: { type: String, required: true },  // Senha do usuário
  dataRegisto: { type: Date, default: Date.now },  // Data de registo, com valor padrão sendo a data atual
});

const User = mongoose.model('User', UserSchema);
export default User;
