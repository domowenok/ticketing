import { PaymentCreatedEvent, Subjects, Listener } from "@smax_ticketing/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import {OrderStatus} from '@smax_ticketing/common';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMesssage(data: PaymentCreatedEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId)
        if(!order){
            throw new Error('Order not found')
        }
        order.set({
            status: OrderStatus.Complete
        })
        await order.save()
        msg.ack()
    }
}