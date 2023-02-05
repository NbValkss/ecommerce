
const express = require("express");
const { createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog, likeBlog,dislikeBlog} = require("../controller/blogCtrl");
const { authMiddleWare, isAdmin } = require("../middlewares/authMiddleWare");
const router = express.Router();

router.post("/", authMiddleWare, isAdmin, createBlog);
router.put("/likes", authMiddleWare, likeBlog);
router.put("/dislikes", authMiddleWare, dislikeBlog);
router.put("/:id", authMiddleWare, isAdmin, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleWare, isAdmin, deleteBlog);


module.exports = router;
