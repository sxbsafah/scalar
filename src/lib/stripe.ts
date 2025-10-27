import { Stripe } from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY!);

export default stripe;
