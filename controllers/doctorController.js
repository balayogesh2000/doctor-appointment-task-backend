const User = require("../models/userModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const params = { name: "", speciality: "" };
  if (req.query.name) params.name = req.query.name;
  if (req.query.speciality) params.speciality = req.query.speciality;
  const doctorsQuery = User.find({
    name: {
      $regex: params.name,
      $options: "i"
    }
  });
  if (params.speciality) {
    doctorsQuery.find({ speciality: params.speciality });
  }
  doctorsQuery.find({ role: "doctor" });
  const doctors = await doctorsQuery;
  res.status(200).json({
    status: "success",
    data: {
      results: doctors.length,
      data: doctors
    }
  });
});
exports.getDoctor = factory.getOne(User);
exports.createDoctor = factory.createOne(User);
exports.updateDoctor = factory.updateOne(User);
exports.deleteDoctor = factory.deleteOne(User);
