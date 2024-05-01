import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
import {
  createProductController,
  getProductsController,
  getSingleProductController,
  getProductPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  categoryWiseProductsController,
  braintreeTokenController,
  braintreePaymentController,
} from "../controllers/productController.js";
import braintree from "braintree";

const router = express.Router();

//routes
//create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//get all product
router.get("/get-product", getProductsController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", getProductPhotoController);

//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//delete product
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//filter products
router.post("/products-filters", productFiltersController);

// product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//serach product
router.get("/search/:keyword", searchProductController);

//similar products
router.get("/related-products/:pid/:cid", relatedProductController);

//category wise products
router.get("/category-wise-products/:slug", categoryWiseProductsController);

//payment route
//token
router.get("/braintree/token" , braintreeTokenController);

//braintree payment
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export { router };
