import { Publisher, OrderCancelledEvent, Subjects} from "@smax_ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}