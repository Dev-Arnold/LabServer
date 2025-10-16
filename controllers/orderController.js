import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Notification from '../models/Notification.js';
import nodemailer from 'nodemailer';

const placeOrder = async (req, res) => {
  try {
    const { billingDetails, items, shippingAddress } = req.body;

 
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

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      billingDetails,
      shippingAddress,
      orderDate
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000
    });

    const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color: #87CEEB; padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            🛒 New Order Received!
          </h1>
          <p style="color: #e8f0fe; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            A customer has just placed an order
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <!-- Order Summary Card -->
          <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #28a745;">
            <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
              📋 Order Summary
            </h2>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 12px 0; border-bottom: 1px solid #e9ecef;">
              <span style="color: #6c757d; font-weight: 500;">Order Total:</span>
              <span style="color: #28a745; font-size: 24px; font-weight: 700;">₦${totalAmount.toLocaleString()}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
              <span style="color: #6c757d; font-weight: 500;">Order Date:</span>
              <span style="color: #495057; font-weight: 600;">${new Date(orderDate).toLocaleString()}</span>
            </div>
          </div>
          
          <!-- Customer Information Card -->
          <div style="background-color: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
              👤 Customer Information
            </h2>
            
            <div style="margin-bottom: 15px;">
              <div style="color: #6c757d; font-size: 14px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</div>
              <div style="color: #2c3e50; font-size: 18px; font-weight: 600;">${billingDetails.firstname} ${billingDetails.lastname}</div>
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="color: #6c757d; font-size: 14px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</div>
              <div style="color: #007bff; font-size: 16px; font-weight: 500;">
                <a href="mailto:${billingDetails.email}" style="color: #007bff; text-decoration: none;">${billingDetails.email}</a>
              </div>
            </div>
            
            ${billingDetails.phone ? `
            <div>
              <div style="color: #6c757d; font-size: 14px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</div>
              <div style="color: #2c3e50; font-size: 16px; font-weight: 500;">${billingDetails.phone}</div>
            </div>
            ` : ''}
          </div>
          
          <!-- Action Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.acconlabscientific.com/accon/order" style="display: inline-block; background-color: #87CEEB; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(135, 206, 235, 0.4); transition: all 0.3s ease;">
              View Order Details
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #2c3e50; padding: 25px 30px; text-align: center;">
          <p style="color: #bdc3c7; margin: 0; font-size: 14px; line-height: 1.6;">
            This is an automated notification from your store system.<br>
            Please log in to your admin panel to manage this order.
          </p>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #34495e;">
            <p style="color: #95a5a6; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} AcconLab Website. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Store Bot" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_RECEIVER_EMAIL,
      subject: '🚨 New Order Received',
      html: adminEmailHtml,
    });
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
  }

  try {
    await Notification.create({
      title: 'New Order',
      message: `₦${totalAmount} from ${billingDetails.firstname}`,
      type: 'order',
      read: false,
      createdAt: new Date(),
    });
  } catch (notificationError) {
    console.error('Notification creation failed:', notificationError);
  }

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

const confirmPayment = async (req, res) => {
  try {
    const { orderId, transactionRef } = req.body;
    
    if (!orderId || !transactionRef) {
      return res.status(400).json({ message: 'Order ID and transaction reference are required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Payment proof is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentProof = req.file.path;
    order.transactionRef = transactionRef;
    order.paymentStatus = 'paid';
    await order.save();

    res.json({ message: 'Payment confirmation submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
    confirmPayment,
    dashboardStats
}