import { PaymentCreatedEvent, Publisher, Subjects } from "@smax_ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;

}