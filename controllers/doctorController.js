const Doctor = require("../models/doctorModel");
const factory = require("./handlerFactory");

exports.getAllDoctors = factory.getAll(Doctor);
exports.getDoctor = factory.getOne(Doctor);
exports.createDoctor = factory.createOne(Doctor);
exports.updateDoctor = factory.updateOne(Doctor);
exports.deleteDoctor = factory.deleteOne(Doctor);
