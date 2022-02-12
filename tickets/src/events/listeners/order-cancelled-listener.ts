import { Listener } from "@smax_ticketing/common";
import { OrderCancelledEvent } from "@smax_ticketing/common";
import { Subjects } from "@smax_ticketing/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled
    queueGroupName = queueGroupName
    async onMesssage(data: OrderCancelledEvent['data'], msg: Message){
        // Find ticket
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket){
            throw new Error('Ticket not found')
        }
        ticket.set({orderId: undefined})
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