import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51QouQdQBXEQG3ZUcNm6MHQBu2fAaw4NpPlzn12eEqhJx8TV9JcD3JrmkRJE5XOOq86ovx8pxW1FyXpKzLAmO0h4J00wtnyESeK', {
  apiVersion: '2025-01-27.acacia',
});

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

app.options('/create-payment-intent', cors());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sample Product',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.send({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});