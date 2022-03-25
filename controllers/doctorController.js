const Doctor = require("../models/doctorModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const params = {};
  if (req.query.name) params.name = req.query.name;
  if (req.query.speciality) params.speciality = req.query.speciality;
  const doctors = await Doctor.find(params);
  res.status(200).json({
    status: "success",
    data: {
      results: doctors.length,
      data: doctors
    }
  });
});
exports.getAllDoctors = factory.getAll(Doctor);
exports.getDoctor = factory.getOne(Doctor);
exports.createDoctor = factory.createOne(Doctor);
exports.updateDoctor = factory.updateOne(Doctor);
exports.deleteDoctor = factory.deleteOne(Doctor);
