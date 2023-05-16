const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcryptjs");
const { createError } = require("../utils/error");
const jwt = require("jsonwebtoken");

// Generate token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWTSECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWTREFRESHSECRET
  );
};

const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const tempUser = {
      id: user._id,
      isAdmin: user.isAdmin,
      username: user.username,
      profile: user.profile,
    };
    const accessToken = generateAccessToken(tempUser);
    const refreshToken = generateRefreshToken(tempUser);

    const newRefresh = new Token({ refresh: refreshToken });
    await newRefresh.save();

    res.status(200).json({
      ...tempUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");

  const isToken = await Token.find({ refresh: refreshToken });
  if (!isToken) {
    return res.status(403).json("Refresh token is not valid!");
  }

  jwt.verify(refreshToken, process.env.JWTREFRESHSECRET, async (err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json("Refresh token: something went wrong!!!");
    }

    try {
      await Token.findOneAndDelete({ refresh: refreshToken });
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      const newToken = new Token({ refresh: newRefreshToken });
      await newToken.save();

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
};

const logout = async (req, res) => {
  const refreshToken = req.body.token;
  try {
    await Token.findOneAndDelete({ refresh: refreshToken });
    res.status(200).json("You logged out successfully.");
  } catch (err) {
    res.status(500).json("Oop! something went wrong!");
  }
};

module.exports = {
  login,
  logout,
  register,
  refresh,
};
