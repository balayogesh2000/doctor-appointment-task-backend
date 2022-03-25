const Doctor = require("../models/doctorModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const params = { name: "", speciality: "" };
  if (req.query.name) params.name = req.query.name;
  if (req.query.speciality) params.speciality = req.query.speciality;
  const doctorsQuery = Doctor.find({
    name: {
      $regex: params.name,
      $options: "i"
    }
  });
  if (params.speciality) {
    doctorsQuery.find({ speciality: params.speciality });
  }
  const doctors = await doctorsQuery;
  res.status(200).json({
    status: "success",
    data: {
      results: doctors.length,
      data: doctors
    }
  });
});
exports.getDoctor = factory.getOne(Doctor);
exports.createDoctor = factory.createOne(Doctor);
exports.updateDoctor = factory.updateOne(Doctor);
exports.deleteDoctor = factory.deleteOne(Doctor);
