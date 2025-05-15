import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Notification from '../models/Notification.js';
import nodemailer from 'nodemailer';

const placeOrder = async (req, res) => {
  try {
    const { billingDetails, items, shippingAddress } = req.body;

    console.log(billingDetails, items, shippingAddress);
 
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    if (!billingDetails || !shippingAddress) {
      return res.status(400).json({ message: 'Billing details and shipping address are required' });
    }
    if (!billingDetails.firstname || !billingDetails.lastname || !billingDetails.email) {
      return res.status(400).json({ message: 'Invalid billing details' });
    }
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state) {
      return res.status(400).json({ message: 'Invalid shipping address' });
    }
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    let totalAmount = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: 'Invalid product in cart' });
      }

      totalAmount += product.price * item.quantity;
    }
    const orderDate = new Date().toISOString();
    console.log(req.user.id)

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      billingDetails,
      shippingAddress,
      orderDate
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const adminEmailHtml = `
    <h2>🛒 New Order Alert</h2>
    <p><strong>Customer:</strong> ${billingDetails.firstname} ${billingDetails.lastname}</p>
    <p><strong>Email:</strong> ${billingDetails.email}</p>
    <p><strong>Total:</strong> ₦${totalAmount.toLocaleString()}</p>
    <p><strong>Order Date:</strong> ${new Date(orderDate).toLocaleString()}</p>
  `;

  await transporter.sendMail({
    from: `"Store Bot" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_RECEIVER_EMAIL,
    subject: '🚨 New Order Received',
    html: adminEmailHtml,
  });

  await Notification.create({
    title: 'New Order',
    message: `₦${totalAmount} from ${billingDetails.firstname}`,
    type: 'order',
    read: false,
    createdAt: new Date(),
  });

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrders = async(req,res,next)=>{
    try {
        const allOrders = await Order.find()
            .populate("user" , "firstName lastName email")
            .populate("items.product", "productName price")
        if(!allOrders) return res.status(404).json({message:"No orders found"});

        res.status(200).json(allOrders)

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
        next(err)
    }
}

const get1Order = async(req,res,next)=>{
    try {
        let { id } = req.params;
        let oneOrder = await Order.findById(id)
            .populate("user" , "firstName lastName email")
            .populate("items.product", "productName image price")
        console.log(oneOrder)

        if(!oneOrder) return res.status(404).json({message:"No order found"});

        res.status(200).json(oneOrder)


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
        next(err)
    }
}

const getOrderByUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let oneOrder = await Order.find({ user: userId })
            .populate("user" , "fullname")
            .populate("items.product", "name")

        if (!oneOrder || oneOrder.length === 0) {
            return res.status(404).json({ message: "user hasn't made any order" });
        }

        res.json(oneOrder);

    } catch (err) {
        console.error(`Failed to fetch deposits : ${err}`);
        next(err);
    }
}

const getRecentOrders = async (req, res, next) => {
    try {
        const recentOrders = await Order.find()
            .sort({ orderDate: -1 })
            .limit(3)
            .populate("user", "firstName lastName email")
            .populate("items.product", "productName price");

        if (!recentOrders) return res.status(404).json({ message: "No recent orders found" });

        res.status(200).json(recentOrders);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
        next(err);
    }
}

const dashboardStats = async (req, res, next) => {
  try {
    const [totalProducts, totalUsers, pendingOrders, completedOrders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments({ deliveryStatus: 'pending' }),
      Order.countDocuments({ deliveryStatus: 'completed' })
    ]);

    res.json({
      totalProducts,
      totalUsers,
      pendingOrders,
      completedOrders,
    });
  } catch (error) {
    console.error("Internal server error", error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
}

export {
    placeOrder,
    getOrders,
    get1Order,
    getOrderByUser,
    getRecentOrders,
    dashboardStats
}