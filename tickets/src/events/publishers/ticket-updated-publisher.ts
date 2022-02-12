import { Publisher, Subjects, TicketUpdatedEvent } from '@smax_ticketing/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}