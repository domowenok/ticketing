import { Subjects, Publisher, ExpirationCompleteEvent } from "@smax_ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}