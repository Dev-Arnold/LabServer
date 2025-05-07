import axios from 'axios';

const verifyPayment = async (req, res, next) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ message: 'No payment reference provided' });
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = response.data;

    if (data.data.status === 'success') {
      // TODO: Save payment, update order, etc
      return res.status(200).json({ 
        message: 'Payment verified successfully', 
        paymentStatus: data.data.status, 
        reference: data.data.reference, 
        amount: data.data.amount, 
        customerEmail: data.data.customer.email 
      });
    } else {
      return res.status(400).json({ message: 'Payment not successful' });
    }
    
  } catch (error) {
    return res.status(500).json({ message: 'Verification failed', error: error.message });
    next(error);
  }
};

// module.exports = { verifyPayment };
export { verifyPayment };
