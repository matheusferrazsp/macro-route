import mongoose, { Document, Model, Schema } from "mongoose";

// Definindo a interface IUser
interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  _id: string; // '_id' já é gerado automaticamente pelo Mongoose, então se você usa string, tudo bem
}

// Definindo o esquema de usuário
const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Garantindo que o email seja único
    },
    password: {
      type: String,
      required: false, // Opcional, caso você tenha autenticação via provedores externos
    },
  },
  {
    timestamps: true, // Para adicionar createdAt e updatedAt automaticamente
  }
);

// Verifica se o modelo já foi criado anteriormente, senão cria o modelo
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
