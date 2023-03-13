import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateToken, isAdmin, isAuth, mailgun } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const userRouter = express.Router();
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);
userRouter.get(
  '/sellers',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({ isSeller: true });
    res.send(users);
  })
);
userRouter.get(
  '/validesellers',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({ isValideSeller: true });
    res.send(users);
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isValideSeller: updatedUser.isValideSeller,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      user.isValideSeller = Boolean(req.body.isValideSeller);
      const updatedUser = await user.save();
      if (updatedUser.isValideSeller) {
        //send mail
        mailgun()
          .messages()
          .send(
            {
              from: 'Bemazone',
              to: `${updatedUser.name} <${updatedUser.email}>`,
              subject: `Validate seller`,
              html: `Welcome. You're successfully become a valide bemazone seller`,
            },
            (error, body) => {
              if (error) {
                console.log(error);
              } else {
                console.log(body);
              }
            }
          );
      }
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(404).send({ message: "Can't delete Admin User" });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isValideSeller: user.isValideSeller,
          token: generateToken(user),
        });
        return;
      } else {
        res.status(500).send({ message: 'Invalid password' });
      }
    } else {
      res.status(404).send({ message: "Email isn't exist" });
    }
  })
);

userRouter.post(
  '/seller/signup',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (user.isSeller || user.isValideSeller) {
        res.status(500).send({
          message: 'This account asked already seller account',
        });
        return;
      }
      user.isSeller = true;
      user.seller.ifu = req.body.ifu;
      user.seller.photoID = req.body.photoID;
      user.seller.name = req.body.sellerName;
      user.seller.logo = req.body.ifu;
      user.seller.description = req.body.description;
      user.password = bcrypt.hashSync(req.body.password, 8);

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isValideSeller: updatedUser.isValideSeller,
        token: generateToken(updatedUser),
        message: `Your ${updatedUser.email} account will be business after validations. It can take while 3 days`,
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        isSeller: true,
        seller: {
          ifu: req.body.ifu,
          photoID: req.body.photoID,
          name: req.body.sellerName,
          logo: req.body.logo,
          description: req.body.description,
        },
      });
      const userSeller = await newUser.save();
      res.send({
        _id: userSeller._id,
        name: userSeller.name,
        email: userSeller.email,
        isAdmin: userSeller.isAdmin,
        isValideSeller: userSeller.isValideSeller,
        token: generateToken(userSeller),
      });
    }
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isValideSeller: user.isValideSeller,
      token: generateToken(user),
    });
  })
);

export default userRouter;
