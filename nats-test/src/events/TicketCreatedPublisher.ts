import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";
import { Publisher } from "./BasePublisher";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject= Subjects.TicketCreated;
}