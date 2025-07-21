import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

const verifyPayment = async (req, res) => {
  const { transaction_id } = req.body;

  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data;

    if (
      paymentData.status === 'success' &&
      paymentData.data.status === 'successful'
    ) {
      // 🎉 Transaction was successful
      // Save order, update user, send email, whatever you want
      return res.status(200).json({
        message: 'Payment verified successfully',
        payment: paymentData.data,
      });
    } else {
      return res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Flutterwave verification error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

export default verifyPayment;