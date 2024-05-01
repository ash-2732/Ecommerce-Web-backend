import { categoryModel } from "../models/categoryModel.js";
import slugify from "slugify";


export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        //validation
        if (!name) {
            return res.status(401).send({
                success: false,
                message: 'Please enter category name'
            })
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: false,
                message: 'Category already exists'
            })
        }
        //create category
        const category = await new categoryModel({
            name,
            slug: slugify(name),
        }).save();
        res.status(201).send({
            success: true,
            message: 'Category created successfully',
            category
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Category creation failed!",
            error
        });
    }
};

//update category
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id ,{name, slug: slugify(name)},{new: true});
        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Category update failed!",
            error
        });
    }
}

//get all categories
export const getCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: 'Categories fetched successfully',
            categories
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Categories fetch failed!",
            error
        });
    }
}

//get single category
export const getSingleCategoryController = async (req, res) => {
    try {
        const {slug} = req.params;
        const category = await categoryModel.findOne({slug});
        res.status(200).send({
            success: true,
            message: 'Single Category fetched successfully',
            category
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Single Category fetch failed!",
            error
        });
    }
}

//delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Category delete failed!",
            error
        });
    }
}



