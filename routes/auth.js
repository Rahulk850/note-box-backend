const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const fetchUser = require("../middleware/fetchUser");
// const { model } = require('mongoose');
const router = express.Router();
var jwt = require("jsonwebtoken");
const JWT_SECRET = "extraordinaryrahul";
//  create a user using posts api/path/createuser no login is required
router.post(
  "/createuser",
  [
    body("name", "name must be of length 3").isLength({ min: 3 }),
    body("email", "invalid email").isEmail(),
    body("password", "password must be of length 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // const user = User(req.body);
    // user.save()
    // res.json(user);
    // // res.send(req.body);
    // console.log(req.body);
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    // check whether user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({
            success: false,
            error: "user with this email is already exist :",
          });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hashSync(req.body.password, salt);
      console.log(secPass);
      // create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.send({ success: true, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);

// AUTHENTICATE A USER USING "/api/auth/login" . no login is required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password can not be empty").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Please try to login with correct crendentials",
          });
      }
      console.log(password);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          return res.status(401).json({ message: 'Authentication failed' });
        }
        const data = {
              user: { id: user.id },
            };
        // Generate a JWT token
        const authtoken = jwt.sign(data, JWT_SECRET);

        res.json({ success:true,authtoken:authtoken });
      });
      // res.send({pass:password});

      // const passCompare = bcrypt.compare(password, User.password);
      // res.send({pass:user.password,passCompare});
      // console.log(passCompare);
      // if (!passCompare) {
      //   return res
      //     .status(400)
      //     .json({
      //       success: false,
      //       error: "Please try to login with correct crendentials",
      //     });
      // }
      // if (passCompare) {
      //   const data = {
      //     user: { id: user.id },
      //   };
      //   const authtoken = jwt.sign(data, JWT_SECRET);
      //   // res.send({pass:user.password,success:true, authtoken });
      // }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);
///////////////////////////////////////////////////////////////
// Get logged in user details using : POST "/api/auth/getuser"

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

module.exports = router;
