import express from "express";
import {testRoute, updateUser} from "../controllers/UserController.js";
import {verifyUser} from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.get('/test', testRoute);
userRouter.post('/update/:id', verifyUser, updateUser);

export default userRouter;