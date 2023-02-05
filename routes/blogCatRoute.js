const  express = require('express');
const { prodcreateCategory,
        updateprodcreateCategory, 
        deleteprodcreateCategory,
        getProdCategory,
        getAllProdCategory } = require('../controller/blogCatCtrl');
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleWare');
const router = express.Router();

router.post("/",authMiddleWare,isAdmin,prodcreateCategory);
router.put("/:id",authMiddleWare,isAdmin,updateprodcreateCategory);
router.delete("/:id",authMiddleWare,isAdmin,deleteprodcreateCategory);
router.get("/:id",getProdCategory);
router.get("/",getAllProdCategory);

module.exports = router;