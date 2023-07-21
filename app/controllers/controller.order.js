const orderModel = require('../models/model.order');

class OrderController {
  index = async (req, res) => {
    const data = await orderModel.find({});
    return res.status(200).render('template/order/orderList', {
      data,
    });
  };

  // store = async (req, res) => {
  //   const data = req.body;
  //   await orderModel.create(data);
  //   return res.status(200).json({
  //     status: 200,
  //     // mes: ' success'
  //   });
  // };

  destroy = async (req, res) => {
    const { id } = req.params;
    const query = {
      _id: id,
    };
    await orderModel.findByIdAndRemove(query).exec();
    return res.redirect('/order');
  };

  update = async (req, res) => {
    const update = {
      status: 'Đang giao',
    };
    const { id } = req.params;
    const query = {
      _id: id,
    };
    await orderModel.updateOne(query, update);
    return res.redirect('/order');
  };
  updateNext = async (req, res) => {
    const update = {
      status: 'Đã giao',
    };
    const { id } = req.params;
    const query = {
      _id: id,
    };
    await orderModel.updateOne(query, update);
    return res.redirect('/order');
  };
  //restfullAPI
  // GET api/store/allOrder
  getAllOrders = async (req, res, next) => {
    try {
      const orders = await orderModel.find();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  };
// POST api/store/create
 createOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    const newOrder = await orderModel.create(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};


}

module.exports = new OrderController();
