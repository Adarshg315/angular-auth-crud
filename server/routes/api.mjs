import express from "express";
import User from "../models/user.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("from API  route");
});

router.post("/register", (req, res) => {
  let userData = req.body;
  let user = new User(userData);
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(registeredUser);
    }
  });
});

router.post("/login", (req, res) => {
  let userData = req.body;
  User.findOne({ email: userData.email }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (!user) {
        res.status(401).send("Invalid Email");
      } else {
        if (user.password !== userData.password) {
          res.status(401).send("Invalid Password");
        } else {
          res.status(200).send(user);
        }
      }
    }
  });
});

export default router;
