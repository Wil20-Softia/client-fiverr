import React, { useState, useEffect } from "react";
import "./Pay.scss";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import newRequest from "../../utils/newRequest.js";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51MlfbnASjzKuk8RqsNV7MNqwRSyVI7OhoYFqI2wJnD8fpISIZVHUmhrRnjHR80hK1ldXck7z0paPds2AwjUZpZLo00mrGe1PMx"
);

const Pay = () => {
    const [clientSecret, setClientSecret] = useState("");

    const {id} = useParams();

    useEffect(() => {
        const makeRequest = async () => { 
            try {
                const res = await newRequest.post(`orders/create-payment-intent/${id}`)
                setClientSecret(res.data.clientSecret);
            } catch (error) {
                console.log(error);
            }
        }

        makeRequest();
    },[]);

    const appearance = {
        theme: 'stripe',
    };
      
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className='pay'>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
};

export default Pay;
