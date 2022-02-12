import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent } from "@smax_ticketing/common"
import { Ticket } from "../../../models/ticket"
import { Message } from "node-nats-streaming"
import mongoose from 'mongoose'

const setup = async ()=>{
    // listener creation
    const listener = new OrderCancelledListener(natsWrapper.client)
    // ticket creation
    const orderId =  mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'concert',
        price: 100,
        userId: '123',
    })
    ticket.set({orderId})
    await ticket.save()
    // data creation
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }
    // msg creation
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {listener, ticket, data, msg, orderId};
}

it('updates the ticket, publishes an event, acks thr message', async()=>{
    const {listener, ticket, data, msg, orderId} = await setup();
    await listener.onMesssage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})