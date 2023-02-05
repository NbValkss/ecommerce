const Category = require("../models/prodcategoryModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../units/validateMongoDbId");

const prodcreateCategory = asyncHandler(async (req, res) =>{
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const updateprodcreateCategory = asyncHandler(async (req, res) =>{
    const { id } = req.params;
    validateMongoDbId(id)
    try{
        const updateprodcreateCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updateprodcreateCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteprodcreateCategory = asyncHandler(async (req, res) =>{
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deleteprodcreateCategory = await Category.findByIdAndUpdate(id);
        res.json(deleteprodcreateCategory);
    } catch (error) {
        throw new Error(error);
    }
});
const getProdCategory = asyncHandler(async (req, res) =>{
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const getaCategory = await Category.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
});
const getAllProdCategory = asyncHandler(async (req, res) =>{
    try{
        const getallProdCategory = await Category.find();
        res.json(getallProdCategory);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
     prodcreateCategory,
     updateprodcreateCategory, 
     deleteprodcreateCategory,
     getProdCategory,getAllProdCategory };
