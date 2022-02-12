import { OrderCancelledEvent } from "@smax_ticketing/common";
import { Listener, OrderStatus, Subjects } from "@smax_ticketing/common";
import { Message, SubscriptionOptions } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMesssage(data: OrderCancelledEvent['data'], msg: Message){
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1 
        })
        if (!order){
            throw new Error("Order not found")
        }
        order.set({status: OrderStatus.Cancelled})
        await order.save()
        msg.ack()
    }
}
