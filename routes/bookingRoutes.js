const express = require("express");
const authControllers = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.use(authControllers.protect);
// router.use(authControllers.restrictTo("admin"));
router
  .route("/")
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);
router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);
router.route("/sendmail").post(bookingController.sendmail);
module.exports = router;
