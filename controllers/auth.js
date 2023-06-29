import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {

    try {
        const {
            firstNmae,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const hashPassword = bcrypt.hash(password, salt);

        const newUser = new User({
            firstNmae,
            lastName,
            email,
            password: hashPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impression: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        console.log("New User added to database");
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User does not exist," });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWR_SECRET);
        delete user.password;

        res.status(200).json({ token, user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}