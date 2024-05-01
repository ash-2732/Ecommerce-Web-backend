import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.ObjectId,
      ref: "Product",
    },
  ],
  payment: {},
  buyer: {
    type: mongoose.ObjectId,
    ref: "users",
  },
  status:{
    type: String,
    default: "Not processed",
    enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"]
  }
},
{
    timestamps: true,
    
});

const orderModel = mongoose.model("Order", orderSchema);
export { orderModel };
