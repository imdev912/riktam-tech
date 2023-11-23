import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user";
import generateToken from "../../config/generateToken";


//@description     Register new user
//@route           POST /api/user/register
//@access          Public
const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, image, about } = req.body;

  if (!name || !email || !password) {
    const fields = [];

    if (!name) fields.push("name");
    if (!email) fields.push("email");
    if (!password) fields.push("password");

    res.status(400)
      .json({
        error: "missing required fields",
        fields: fields
      });

    throw new Error("missing required fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409)
      .json({
        error: "email already exists",
      });

    throw new Error("email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    image,
    about
  });

  if (user) {
    res.status(201)
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image,
        about: user.about,
        token: generateToken(user._id),
      });
  } else {
    res.status(400);
    throw new Error("user not found");
  }
});

//@description     Auth the user
//@route           POST /api/user/auth
//@access          Public
const authUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      image: user.image,
      about: user.about,
      token: generateToken(user._id),
    });
  } else {
    res.status(401)
      .json({
        error: "invalid credentials"
      });

    throw new Error("Invalid Email or Password");
  }
});

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

export { allUsers, registerUser, authUser };