import React, { useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest.js";
import "./Success.scss";

const Success = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search);
    const payment_intent = params.get("payment_intent"); 

    useEffect(()=>{
        const makeRequest = async () => {
            try {
                await newRequest.put("orders/", { payment_intent });
                setTimeout(()=>{
                    navigate("/orders")
                }, 5000)
            } catch (error) {
                console.log(error);
            }
        }

        makeRequest();
    },[])

    return (
        <div>Pago exitoso. Usted será redirigido a la pagina de Ordenes. Por favor no cierre la pagina</div>
    )
}

export default Success