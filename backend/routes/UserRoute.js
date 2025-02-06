import express from "express";
import {deleteUser, testRoute, updateUser} from "../controllers/UserController.js";
import {verifyUser} from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.get('/test', testRoute);
userRouter.post('/update/:id', verifyUser, updateUser);
userRouter.delete('/delete/:id', verifyUser, deleteUser);

export default userRouter;