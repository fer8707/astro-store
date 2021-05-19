const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: false,
      required: [true, 'Product name'],
      unique: false
    },
    description: {
      type: String,
      trim: false,
      required: [true, 'Product description'],
      unique: false
    },
    image: {
      type: String,
      trim: false,
      required: [true, 'URL image'],
      unique: false
    },
    price: {
      type: Number,
      trim: true,
      required: [true, 'product price'],
      unique: false
    },
    category: {
      type: String,
      trim: true,
      required: [true, 'product category'],
      unique: false
    },
  },
  {
    timestamps: true
  }
);

module.exports = model('Product', productSchema);
