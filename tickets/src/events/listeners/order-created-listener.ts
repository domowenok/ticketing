import { Listener, OrderCreatedEvent, OrderStatus } from "@smax_ticketing/common";
import { Subjects } from "@smax_ticketing/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher"

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName
    async onMesssage(data: OrderCreatedEvent['data'], msg: Message){
        // Find ticket which we intrested in
        const ticket = await Ticket.findById(data.ticket.id)
        // If no ticket send an error
        if (!ticket){
            throw new Error('Ticket not found')
        }
        ticket.set({orderId: data.id})
        await ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })
        // ack the message
        msg.ack()

    }
}