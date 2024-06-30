import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //check Existing user
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(q, [req.body.email, req.body.name], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // as pasword cannot keep in plain text

    //hash the password

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    //inser the values into data base

    const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  //check user name

  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    //if user not exist
    if (data.length === 0) return res.status(404).json("User not found!");

    //Check password
    //compare sync is used to compare password as we passing pasword in palin text
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    //if usser id matches with post userid then we are allowed to delete
    const token = jwt.sign({ id: data[0].id }, "jwtkey");

    //so we cannot pass the password
    //specific info of data
    const { password, ...other } = data[0];

    //any script can not reached to cookie directly
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: false, // Change to true if using HTTPS
      sameSite: "Lax",
    })
    .status(200)
    .json("User has been logged out.");
};
