const express = require("express");
const userControllers = require("../controllers/userController");
const authControllers = require("../controllers/authController");

const usersRouter = express.Router();

usersRouter.route("/signup").post(authControllers.signup);
usersRouter.route("/login").post(authControllers.login);

usersRouter.use(authControllers.protect);

usersRouter.route("/me").get(userControllers.getMe, userControllers.getUser);
usersRouter.route("/updateMe").patch(userControllers.updateMe);
usersRouter.route("/deleteMe").delete(userControllers.deleteMe);

usersRouter.use(authControllers.restrictTo("admin"));

usersRouter
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
usersRouter
  .route("/:id")
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = usersRouter;
