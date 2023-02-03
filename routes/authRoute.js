const express = require("express");
const router = express.Router();
const {createUser,loginUserctrl,
 getAllUser,getaUser,deleteaUser,
 updatedUser,blockUser,unblockUser,
 handleRefreshToken,logoutFunction,
 updatePassword,forgotPasswordToken,
 resetPassword} = require("../controller/userCtrl");
const {authMiddleWare,isAdmin} = require("../middlewares/authMiddleWare");


router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleWare, updatePassword)
router.post("/login", loginUserctrl);
router.get("/:id",authMiddleWare, isAdmin, getaUser);
router.get("/all-users", getAllUser);
router.delete("/:id", deleteaUser);
router.put("/edit-user", authMiddleWare, updatedUser);
router.put("/block-user/:id", authMiddleWare, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleWare, isAdmin, unblockUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout",logoutFunction);

module.exports = router;
