import express from "express";
import {testRoute} from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get('/test', testRoute)

export default userRouter;