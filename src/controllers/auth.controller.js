const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGN UP
exports.register = async (req, res) => {
  try {
    const { userName, email, mobileNumber, password } = req.body;

    const userExist = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (userExist) {
      return res.status(400).json({ message: "Email or Mobile Number already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({ userName, email, mobileNumber, password: hashedPass });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Email or Password" });

    const token = jwt.sign({ id: user._id }, "SECRET_KEY", {
      expiresIn: "7d",
    });

    res.json({
      message: "Login Success",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// GET USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne().select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// UPDATE USER PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { userName, mobileNumber } = req.body;
    
    const user = await User.findOneAndUpdate(
      {},
      { userName, mobileNumber },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ error });
  }
};