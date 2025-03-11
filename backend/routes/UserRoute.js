import express from "express";
import {deleteUser, getUser, getUserListings, testRoute, updateUser} from "../controllers/UserController.js";
import {verifyUser} from "../utils/VerifyUser.js";

const userRouter = express.Router();

userRouter.get('/test', testRoute);
userRouter.post('/update/:id', verifyUser, updateUser);
userRouter.delete('/delete/:id', verifyUser, deleteUser);
userRouter.get('/listings/:id', verifyUser, getUserListings);
userRouter.get('/:id', verifyUser, getUser);

export default userRouter;