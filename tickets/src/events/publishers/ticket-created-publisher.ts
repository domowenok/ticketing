import { Publisher, Subjects, TicketCreatedEvent } from '@smax_ticketing/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}


