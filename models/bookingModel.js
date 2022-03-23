const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctors",
    required: [true, "Booking must belong to a doctor"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user"]
  },
  price: {
    type: Number,
    require: [true, "Booking must have a price"]
  },
  slot: {
    type: Date
  },
  paid: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate("user").populate("doctor");
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
