const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Usa un correo electrónico válido (@,.com)'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      trim: true,
      enum: ['admin', 'user'],
      default: 'user'
    },
    cart: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);