const express = require("express");
const doctorController = require("../controllers/doctorController");
// const authControllers = require("../controllers/authController");

const doctorsRouter = express.Router();

// doctorsRouter.use(authControllers.protect);

doctorsRouter.route("/").get(doctorController.getAllDoctors);
doctorsRouter.route("/:id").get(doctorController.getDoctor);

// doctorsRouter.use(authControllers.restrictTo("admin"));

doctorsRouter.route("/").post(doctorController.createDoctor);
doctorsRouter
  .route("/:id")
  .patch(doctorController.updateDoctor)
  .delete(doctorController.deleteDoctor);

module.exports = doctorsRouter;
