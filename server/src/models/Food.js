
import mongoose from 'mongoose';

const sizeOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceOffset: { type: Number, required: true, default: 0 }
});

const modifierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceOffset: { type: Number, required: true, default: 0 }
});

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  ingredients: [{ type: String }],
  calories: { type: Number },
  spicyLevel: {
    type: String,
    enum: ['None', 'Mild', 'Medium', 'Hot'],
    default: 'None'
  },
  sizeOptions: [sizeOptionSchema],
  hasCookingPreference: { type: Boolean, default: false },
  availableToppings: [modifierSchema],
  availableSauces: [{ type: String }]
}, {
  timestamps: true,
});

const Food = mongoose.model('Food', foodSchema);

export default Food;
