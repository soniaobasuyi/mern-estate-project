import {errorHandler} from "../utils/Error.js";
import bcryptjs from "bcryptjs";
import User from "../models/UserModel.js";

export const testRoute = (req, res) => {
    res.json({
        message: "this route is working"
    });
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account!'));

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            },
        },
            {new: true}
        );

        const {password, ...userInfoWithoutPassword} = updatedUser._doc;
        res.status(200).json(userInfoWithoutPassword);
    } catch (error) {
        next(error);
    }
};