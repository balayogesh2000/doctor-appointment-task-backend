const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A doctor must have a name"],
    unique: true,
    trim: true
  },
  speciality: {
    type: String,
    required: [true, "A doctor must belong to a department"]
  },
  fee: {
    type: Number,
    required: [true, "A dotor must have a consultation fee"]
  }
});

const Tours = mongoose.model("Doctors", doctorSchema);

module.exports = Tours;
