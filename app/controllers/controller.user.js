const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/model.user');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res
          .status(400)
          .json({ status: false, message: 'All input is required!' });
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: 'Email is not existed!' });
      }
      if (user && (await bcrypt.compare(password, user.password))) {
        const userSign = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          image: user.image,
          dayOfBirth: user.dayOfBirth,
          gender: user.gender,
        };
        console.log(
          '🚀 ~ file: controller.user.js ~ line 34 ~ AuthController ~ login ~ userSign',
          userSign
        );
        const token = jwt.sign(userSign, process.env.TOKEN_KEY, {
          expiresIn: '2h',
        });
        console.log(
          '🚀 ~ file: controller.user.js ~ line 37 ~ AuthController ~ login ~ token',
          token
        );
        return res.status(200).json({ token });
      }
      res.status(400).json({ status: false, message: 'Invalid Credentials' });
    } catch (error) {
      return res.status(400).json({ status: false, error });
    }
  }
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, role, image } = req.body;

      if (!(firstName && lastName && email && password && role && image)) {
        return res.status(400).json({ message: 'All input is required!' });
      }
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return res.status(400).json({ message: 'User email already exist!' });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
        role,
        image,
      });
      const token = jwt.sign(
        {
          user_id: user._id,
          firstName,
          lastName,
          email,
          role,
          image,
        },
        process.env.TOKEN_KEY,
        { expiresIn: '2h' }
      );
      user.token = token;
      return res.status(200).json({ status: true, user });
    } catch (error) {
      return res.status(400).json({ status: false, error });
    }
  }
  // Admin
  async userGetList(req, res) {
    try {
      const users = await userModel.find().select('-password');
      return res
        .status(200)
        .render('template/user/list', { message: '', users });
    } catch (error) {
      return res.status(400).redirect('/');
    }
  }
  async userAuthorize(req, res) {
    const { id } = req.params;
    if (id) {
      try {
        await userModel.update({ _id: id }, { role: 'admin' });
        res.status(300).redirect('/user-manager/list');
      } catch (error) {
        res.status(300).redirect('/user-manager/list');
      }
    }
  }
  async userUnAuthorize(req, res) {
    const { id } = req.params;
    if (id) {
      try {
        await userModel.update({ _id: id }, { role: 'user' });
        res.status(300).redirect('/user-manager/list');
      } catch (error) {
        res.status(300).redirect('/user-manager/list');
      }
    }
  }
  //[get] /user/:id/edit
  async userGetByid(req, res) {
    try {
      const users = await userModel.findById(req.params.id).select('-password');
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ message: 'Error getting user' });
    }
  }
  //[get] /user/allUser
  // users get edit deltail by themserft
  async apiUserPostEdit(req, res) {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res
          .status(400)
          .json({ status: false, message: 'All input is required!' });
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ status: false, message: 'Email is not existed!' });
      }
      if (user && (await bcrypt.compare(password, user.password))) {
        const userSign = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          image: user.image,
          dayOfBirth: user.dayOfBirth,
          gender: user.gender,
        };
        console.log(
          '🚀 ~ file: controller.user.js ~ line 34 ~ AuthController ~ login ~ userSign',
          userSign
        );
        const token = jwt.sign(userSign, process.env.TOKEN_KEY, {
          expiresIn: '2h',
        });
        console.log(
          '🚀 ~ file: controller.user.js ~ line 37 ~ AuthController ~ login ~ token',
          token
        );
        return res.status(200).json({ token, userSign });
      }
      res.status(400).json({ status: false, message: 'Invalid Credentials' });
    } catch (error) {
      return res.status(400).json({ status: false, error });
    }
  }

  //[PUT] /users/:id/update
  // async userUpdate(req, res, next) {
  //   try {
  //     await userModel.updateOne({ _id: req.params.id }, req.body);
  //     return res.status(200).json({ message: 'User updated successfully' });
  //   } catch (error) {
  //     return res.status(400).json({ message: 'Error updating user' });
  //   }
  // }
  // async userGetUpdate(req, res, next) {
  //   try {
  //     const updatedUser = await userModel.findByIdAndUpdate(
  //       { _id: req.params.id },
  //       req.body,
  //       { new: true }
  //     );
  //     if (!updatedUser) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  //     res.json(updatedUser);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
 
    async updateUserById(req, res, next)  {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });
      console.log(updatedUser);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();
