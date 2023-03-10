
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { find } = require("../models/userModel");
const { generateToken } = require("../config/jwtToken");
 const validateMongoDbid = require("../units/validateMongoDbId");
 const {generateRefreshToken} = require("../config/refreshToken");
 const crypto = require('crypto');
 const jwt = require("jsonwebtoken");
 const sendEmail = require("./emailCtrl");


const createUser = asyncHandler(async(req, res) => {
          const email = req.body.email;
            const findUser = await User.findOne({ email: email });
            if (!findUser) {
                //Create a new User
                const newUser = await User.create(req.body);
                res.json(newUser);
            }else {
                //user Allready Exist
               throw new Error("User already exists");
           }
        });
        const loginUserctrl = asyncHandler(async (req, res) => {
           
            const { email, password } = req.body;
           // check if user exits or not
           const findUser = await User.findOne({ email });
           if(findUser && ( await findUser.isPasswordMatched(password))) {
            const refreshToken = await generateRefreshToken(findUser?._id);
            const updatedUser = await User.findByIdAndUpdate(
                findUser.id, {
                refreshToken: refreshToken,
            },
            { new:true }
            );
             res.cookie("refreshToken", refreshToken, {
                httpOnly:true,
                maxAge: 72 * 60 * 60 * 1000,
             });
            res.json({
                 _id: findUser?._id,
                 firstname: findUser?.firstname,
                 lastname: findUser?.lastname,
                 email: findUser?.email,
                 mobile: findUser?.mobile,
                 token: generateToken(findUser?._id)
            
            });
        
         }else{
            throw new Error("Invalid Credentials");
            }
        });
        //Get all users
        const getAllUser = asyncHandler(async (req, res) =>{
            try{
                const getAllUser = await User.find();
                res.json(getAllUser);

            }catch (error) {
                throw new Error(error);
            }
        });
        //Get a single user 
        const getaUser = asyncHandler(async (req, res) => {
            const { id } = req.params;
             validateMongoDbid(id);
           try{
            const getaUser = await User.findById(id);
            res.json({ getaUser });
           } catch (error){
            throw new Error(error)
           }
        });
        // handle refresh token
        const handleRefreshToken = asyncHandler(async (req, res) => {
          const cookie = req.cookies;
          if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
          const refreshToken = cookie.refreshToken;
          const user = await User.findOne({ refreshToken });
          if(!user) throw new Error("No token available");
          jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) =>{
            if (err || user.id !== decoded.id ){
                throw new Error ("Invalid token");
            }
            const acessToken = generateToken(user?._id)
            res.json({ accessToken });
          });
        })
        // logout functionality
        const logoutFunction = asyncHandler (async (res, req) =>{
        const cookie = req.cookies;
          if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
          const refreshToken = cookie.refreshToken;
          const user = await User.findOne({ refreshToken });
          if(!user){
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true, 
            });
            return res.sendStatus(204); // forbidden
          }
          await User.findByIdAndUpdate(refreshToken,{
            refreshToken: "",
        });
          res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true, 
          });
          return res.sendStatus(204); //forbidden
        });
       //update a user 
       const updatedUser = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        validateMongoDbid(_id);
        try {
            const updatedUser = await User.findByIdAndUpdate(
        _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },{
                new: true,
            })
            res.json(updatedUser);
        } catch (error){
            throw new Error(error);
        }
       })



        //delete a single user 
        const deleteaUser = asyncHandler(async (req, res) => {
            const { id } = req.params;
            validateMongoDbid(id);
           try{
            const deleteaUser = await User.findByIdAndDelete(id);
            res.json({
                deleteaUser,
            })
           } catch (error){
            throw new Error(error)
           }
        })
 const blockUser = asyncHandler(async(req,res)=>{
  const { id } = req.params;
  validateMongoDbid(id);
  try{
    const block = await User.findByIdAndUpdate(
        id,{
            isBlocked: true,
        },
        {
        new: true,
        }
    );
    res.json({
        message: "user Blocked",
    })
  }catch(error){
    throw new Error(error);
  }
 })    
 const unblockUser = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    validateMongoDbid(id);
   try{
   const unblock = await User.findByIdAndUpdate(
    id,{
        isBlocked: false,
    },
    {
        new: true,
    },  
   );
   res.json({
    message: "user unblocked",
})
   }catch (error){
    throw new Error(error)
   }
});
const updatePassword = asyncHandler(async (req, res) => {
    console.log(req.body);
   
    const { _id} = req.user;
    const {password} = req.body;
    validateMongoDbid(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword)
    }else{
        res.json(user);
    }

});
const forgotPasswordToken = asyncHandler(async (req, res) => {
const {email} = req.body;
const user = await User.findOne({email});
if (!user) throw new Error("User not found with this email");

try{
const token = await user.createPasswordResetToken();
await user.save();
const resetURL = `Hi, Please follow this link to reset Your Password.This link is valid till 10 minutes from now
  <a href='http://127.0.0.1:5000/api/user/reset-password/${token}'>Click Here</a>`;
  const data = {
    to: email,
    text: "Hey User",
    subject: "Forgot Password Link",
    html: resetURL,
  };
  sendEmail(data);
  res.json(token);
} catch(error) {
 throw new Error(error);
}
});
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now()},
    });
   if(!user) throw new Error(" Token Expired Please try again later");
   user.password = password;
   user.passwordResetToken = undefined;
   user.passwordResetExpires = undefined;
   await user.save();
   res.json(user);
});
module.exports = {
    createUser,loginUserctrl,
    getAllUser,getaUser,deleteaUser,
    updatedUser,blockUser,unblockUser,
    handleRefreshToken,logoutFunction,
    updatePassword,forgotPasswordToken,resetPassword};