const express = require("express");
const { createCategoryCtrl, fetchAllCategoriesCtrl, fetchCategoryCtrl,
    updateCategoryCtrl,deleteCategoryCtrl } = require("../../controllers/category/categoryCtrl");
const categoryRoute = express.Router();
const authMiddleware = require("../../middlewares/auth/authMiddleware");


categoryRoute.post("/",authMiddleware, createCategoryCtrl);
categoryRoute.get("/",authMiddleware, fetchAllCategoriesCtrl);
categoryRoute.get("/:id",authMiddleware, fetchCategoryCtrl);
categoryRoute.put("/:id",authMiddleware, updateCategoryCtrl);
categoryRoute.delete("/:id",authMiddleware, deleteCategoryCtrl);

module.exports = categoryRoute;