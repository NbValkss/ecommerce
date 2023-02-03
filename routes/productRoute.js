const express = require("express");
const {createProduct,getaProduct,getAllProduct,
    updateProduct,deleteProduct} = require("../controller/productCtrl");
const router = express.Router();
const {isAdmin, authMiddleWare } = require("../middlewares/authMiddleWare")


router.post("/",  authMiddleWare,isAdmin, createProduct);
router.get("/:id", getaProduct);
router.put("/:id", authMiddleWare,isAdmin, updateProduct);
router.delete("/:id", authMiddleWare,isAdmin, deleteProduct);
router.get("/", getAllProduct);



module.exports = router;