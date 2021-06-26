import axios from "axios";
import { showAlert } from './alerts';


export const bookTour = async tourId => {
    const stripe = Stripe('pk_test_51J4pd1KMhozsyWJZCnY08Lrbqd7bs0gVGxXVj4eMGE3EH9Wyu4BvG2WqXK8UaLxivct4U8mlzSIsVkIa8l36PJZp001uBsehPl');
    
    try {
        // 1) Get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    
        // 2) Create checkout from + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
