import request from 'supertest';
import {app} from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/tickets';
import mongoose from 'mongoose'

it('fetches the order', async ()=>{
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()
    const userOne = global.signin();
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticket.id})
        .expect(201)
    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', userOne)
        .send()
        .expect(200)
    expect(fetchedOrder.id).toEqual(order.id)
})

it('it return an error if one user want fetch data of other', async ()=>{
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()
    const userOne = global.signin();
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticket.id})
        .expect(201)
     await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401)
})