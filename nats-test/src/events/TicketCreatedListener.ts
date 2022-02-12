import {Listener} from './BaseListener'
import {Message} from 'node-nats-streaming'
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payment-service';
    onMesssage(data:TicketCreatedEvent['data'], msg: Message){
            console.log("Event Data", data)
            msg.ack()
        }
    
}