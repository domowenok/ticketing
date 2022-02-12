import { useState, useEffect } from "react";
import {useRequest} from '../../hooks/useRequest';
import StripeCheckout from 'react-stripe-checkout';
import Router from "next/router";

const OrderShow = ({order, currentUser})=>{
    const [timeLeft, setTimeLeft] = useState(0);
    const {doRequest, errors} = useRequest({
        url: '/api/payment',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => {Router.push('/orders')}
    })
    useEffect(()=>{
        const findTimeLeft = ()=>{
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 100))
        }
        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000)
        return () =>{
            clearInterval(timerId)
        }
    }, [order])
    if (timeLeft < 0){
        return <div>Order Expired</div>;
    }
    return (
        <div>Time left to pay {msLeft} seconds until order expires
            <StripeCheckout token = {({id}) = doRequest({token: id})} stripeKey="pk_test_51JgzqbIYJqXZLYF9nsHedZaRMwi1vYQTtd0b1GUSBw2yFu1yZdfX9vnMTNF4fd65prqIrfyaciEJC3yeIKJRpiLd00dH4pgqb6"
                amount = {orderId.ticket.price * 100}
                email = {currentUser.email}
            />
            {errors}
        </div>
    );
}

OrderShow.getInitialProps = async ({context, client})=>{
    const {orderId} = context.query
    const {data} = await client.get(`/api/orders/${orderId}`)
    return {order: data}
}

export default OrderShow;