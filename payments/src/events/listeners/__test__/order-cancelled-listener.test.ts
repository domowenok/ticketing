import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent, OrderStatus } from "@smax_ticketing/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import mongoose from 'mongoose'
import { Order } from "../../../models/order";

const setup = async ()=>{
    // create a listener
    const listener = new OrderCancelledListener(natsWrapper.client)
    // create a ready ticket for test
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: 'dfvfdvf',
        status: OrderStatus.Created,
        price: 10
    })
    await order.save()
    // create data for listener
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString(),
        }
    }
    // create msg
    // @ts-ignore
    const msg: Message  = {
        ack: jest.fn()
    }
    return {listener, data, order, msg};
}

it('updates the status of the order', async()=>{
    const {listener, data, order, msg} = await setup();

    await listener.onMesssage(data, msg)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async()=>{
    const {listener, data, order, msg} = await setup();

    await listener.onMesssage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})