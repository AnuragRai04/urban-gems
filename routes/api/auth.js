// routes/api/auth.js
const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);

    const token = signToken(registeredUser);
    res.status(201).json({
      token,
      user: {
        id: registeredUser._id,
        username: registeredUser.username,
        email: registeredUser.email,
      },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// passport.authenticate with session: false prevents Passport from trying to use cookies/sessions
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = signToken(req.user);
    res.json({
      token,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  },
);

module.exports = router;
