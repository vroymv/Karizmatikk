//Importing Libraries
require("dotenv").config();
const mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");

main().catch((err) => console.log(err));

//Mongoose DB connection
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

//Schema for the wishes
const wishesSchema = new mongoose.Schema({
  message: String,
  messageImage: {
    imgType: String,
    imgUrl: String,
  },
});
const Wish = new mongoose.model("Wish", wishesSchema);

//Push Notification Tokens Schema
const pushNotificationSchema = new mongoose.Schema({
  userId: String,
  token: String,
});
const PushToken = new mongoose.model(
  "PushNotificationToken",
  pushNotificationSchema
);

//Schema for Users
const userSchema = new mongoose.Schema({
  profileImage: {
    imgType: String,
    imgUrl: String,
  },
  username: String,
  roomNumber: String,
  phoneNumber: String,
  password: String,
  lastOrder: Date,
});
const options = {
  hashField: "password",
  usernameQueryFields: ["phoneNumber", "username"],
};
userSchema.plugin(passportLocalMongoose, options);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("user", userSchema);

//Schema for Our Work
const ourWorkSchema = new mongoose.Schema({
  image1: {
    imgType: String,
    imgUrl: String,
  },
  image2: {
    imgType: String,
    imgUrl: String,
  },
  brand: String,
});
const OurWork = new mongoose.model("OurWork", ourWorkSchema);

//Schema for Order
const orderSchema = new mongoose.Schema({
  userId: String,
  numberOfShoes: Number,
  status: String,
  image: {
    imgType: String,
    imgUrl: String,
  },
  pickupTime: Date,
  deliveryTime: Date,
  orderTime: Date,
});
const Order = new mongoose.model("Order", orderSchema);

//Schema for messages
const messageSchema = new mongoose.Schema({
  userId: String,
  content: String,
  sendTime: Date,
  name: String,
  phoneNumber: String,
  admin: Boolean,
  viewed: Boolean,
});

const Messages = new mongoose.model("Messages", messageSchema);

module.exports = { main, Wish, User, OurWork, Order, Messages, PushToken };
