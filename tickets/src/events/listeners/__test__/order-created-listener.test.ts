import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent } from "@cygnetops/common";
import mongoose from 'mongoose'
import { OrderStatus } from "@smax_ticketing/common";
import { Message } from "node-nats-streaming";

const setup = async ()=>{
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    // create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 100,
        userId: '123'
    })
    await ticket.save()
    // Create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'dfnfddfn',
        expiresAt: 'fdfddf',
        ticket: {
            id: ticket.id,
            price: 100
        }
    }
    //  @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {listener, ticket, data, msg};
}

it('sets the userId of the ticket', async()=>{
    const {listener, ticket, data, msg} = await setup();
    await listener.onMesssage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).toEqual(data.id)
})


it('acks the message', async()=>{
    const {listener, ticket, data, msg} = await setup();
    await listener.onMesssage(data, msg);
    expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async()=>{
    const {listener, ticket, data, msg} = await setup();
    await listener.onMesssage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(data.id).toEqual(ticketUpdatedData.orderId)
})