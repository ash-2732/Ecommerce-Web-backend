import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD: POST
router.post("/register", registerController);

//LOGIN || METHOD: POST
router.post("/login", loginController);

//FORGOT PASSWORD || METHOD: POST
router.post("/forgot-password", forgotPasswordController);

//TEST || METHOD: GET
router.get("/test", requireSignIn, isAdmin, testController);

//protected route user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//protected route admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//update user profile
router.put("/update-profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//status update
router.put("/order-status/:orderId" , requireSignIn , isAdmin , orderStatusController)

export { router };
