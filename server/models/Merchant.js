const mongoose = require("mongoose");
// this schema will show how waste listings in the businessman/merchant accounts will be stored
const MerchantSchema = new mongoose.Schema({
  //we will use this to link a specific app user
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //now we will define the type of waste one wishes to sell
  wasteType: {
    type: String,
    required: [true, "Please specify the type of waste"],
  },
  // to know what the weight of the product is
  estimatedWeight: {
    type: Number,
    required: [true, "Please provide an estimated weight"],
  },
//visual represntation of what the product looks like through the merchant account UI
imageUrl: {
type: String,
default:"https://via.placeholder.com/150"
},
status:{
type: String,
enum: ['Available', 'Pending', 'Claimed'],
default:'Available'
},
createdAt: {
type: Date,
default:Date.now
}
});

module.exports = mongoose.model('Merchant', MerchantSchema);
