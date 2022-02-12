import { Publisher, OrderCreatedEvent, Subjects} from "@smax_ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}