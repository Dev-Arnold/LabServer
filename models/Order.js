import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const billingDetailsSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phone:{type: Number, rerequired:true}
});

const shippingAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    billingDetails: billingDetailsSchema,
    shippingAddress: shippingAddressSchema,
    totalAmount: {
      type: Number,
      required: true
    },
    orderDate:{
      type:Date,
      required: false
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'shipped', 'delivered'],
      default: 'pending'
    },
    isNewOrder: {
      type: Boolean,
      default: true, // helps the admin see fresh orders
    }
  },
  {
    timestamps: true
  }
);

let Order = mongoose.model('Order', orderSchema);
export default Order;