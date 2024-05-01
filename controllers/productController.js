import slugify from "slugify";
import { ProductModel } from "../models/productModel.js";
import fs from "fs";
import { categoryModel } from "../models/categoryModel.js";
import { orderModel } from "../models/orderModel.js";
import braintree from "braintree";
import dotenv from "dotenv";


//configure dotenv it is must
dotenv.config();
//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const createProductController = async (req, res) => {
  try {
    const { name, price, category, description, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(401).send({
          success: false,
          message: "Please enter product name",
        });
      case !price:
        return res.status(401).send({
          success: false,
          message: "Please enter product price",
        });
      case !category:
        return res.status(401).send({
          success: false,
          message: "Please enter product category",
        });
      case !description:
        return res.status(401).send({
          success: false,
          message: "Please enter product description",
        });
      case !quantity:
        return res.status(401).send({
          success: false,
          message: "Please enter product quantity",
        });
      case !shipping:
        return res.status(401).send({
          success: false,
          message: "Please enter product shipping",
        });
      case photo && photo.size > 1000000:
        return res.status(401).send({
          success: false,
          message: "Image size should be less than 1mb",
        });
    }
    //create product
    const products = new ProductModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Product creation failed!",
      error,
    });
  }
};

//get products
export const getProductsController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({
        createdAt: -1,
      }); //exclude photo
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to get products",
      error,
    });
  }
};

//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to get product",
      error,
    });
  }
};

//get product photo
export const getProductPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");
    if (!product || !product.photo.data) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.set("Content-Type", product.photo.contentType);
    res.status(200).send(product.photo.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to get product photo",
      error,
    });
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOneAndDelete({
      _id: req.params.pid,
    }).select("-photo");
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to delete product",
      error,
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const { name, price, category, description, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(401).send({
          success: false,
          message: "Please enter product name",
        });
      case !price:
        return res.status(401).send({
          success: false,
          message: "Please enter product price",
        });
      case !category:
        return res.status(401).send({
          success: false,
          message: "Please enter product category",
        });
      case !description:
        return res.status(401).send({
          success: false,
          message: "Please enter product description",
        });
      case !quantity:
        return res.status(401).send({
          success: false,
          message: "Please enter product quantity",
        });
      case !shipping:
        return res.status(401).send({
          success: false,
          message: "Please enter product shipping",
        });
      case photo && photo.size > 1000000:
        return res.status(401).send({
          success: false,
          message: "Image size should be less than 1mb",
        });
    }
    //update product
    const products = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Product updated failed!",
      error,
    });
  }
};

//filter products
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio) {
      args.price = {
        $gte: radio[0],
        $lte: radio[1],
      };
    }
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      message: "Products filtered successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Failed to filter products",
      error,
    });
  }
};

//product count
export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Failed to get product count",
      error,
    });
  }
};

//product list base on page
export const productListController = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const perPage = 3;
    const products = await ProductModel.find({})
      .select("-photo")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Failed to get products",
      error,
    });
  }
};


//search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } }, //case insensitive
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Failed to search products",
      error,
    });
  }
};

//related products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel.find({
      _id: { $ne: pid },
      category: cid,
    }).select('-photo').limit(3).populate('category');
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Failed to get related products",
      error,
    });
  }
};

//category wise products
export const categoryWiseProductsController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await ProductModel.find({category}).populate('category');
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Failed to get category wise products",
      error,
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "FAILED TO GET TOKEN",
          error: err,
        });
      }
      res.send(response);
    });
  } catch (error) {
    console.log(error)
  }
};

//braintree payment
export const braintreePaymentController = async (req, res) => {
  try {
    const {cart , nonce} = req.body;
    let total = 0;
    cart.map((item) => {
      total += item.price;
    });
    let newTransaction = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    }, (err, result) => {
      if( result){
        const order = new orderModel({
          products: cart,
          payment: result,
          buyer: req.user._id,
        });
        order.save();
        res.json({
          ok: true,
        })
      }
      else{
        res.status(500).send({
          success: false,
          message: "FAILED TO PROCESS PAYMENT",
          error: err,
        });
      }
    });
  } catch (error) {
    console.log(error)
  }
};
