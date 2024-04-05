import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { sign, Secret } from "jsonwebtoken";
import User from "../models/user";
import dotenv from "dotenv";

interface UserType {
  username: string;
  email: string;
  password: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  id: string;
}

dotenv.config();

const accessTokenValue: Secret | undefined = process.env.ACCESS_TOKEN_SECRET;

//@desc Register User
//@route POST /users/register
//@access public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields are mandatory" });
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400).json({ message: "User already registered" });
    throw new Error("User already registered");
  }

  //Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password", hashedPassword);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log("User created", user);

  if (user) {
    res
      .status(201)
      .json({ _id: user.id, email: user.email, message: "Success" });
  } else {
    res.status(400).json({ message: "User data is not valid" });
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login User
//@route POST /users/login
//@access public
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are mandatory" });
    throw new Error("All fields are mandatory");
  }
  const user: UserType | null = await User.findOne({ email });
  // const comparePass =
  //compare password
  if (user !== null && (await bcrypt.compare(password, user.password))) {
    const accessToken = sign(
      {
        user: { username: user.username, email: user.email, id: user.id },
      },
      accessTokenValue as Secret,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken, user, message: "Success" });
  } else {
    res.status(401).json({ message: "Email or password is not valid" });
    throw new Error("Email or password is not valid");
  }
});

export { registerUser, loginUser };
