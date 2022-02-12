import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { OrderStatus } from '@smax_ticketing/common';
import {stripe} from '../../stripe' 
// jest.mock('../../stripe');

it('return a 404 when purchasing an order that does not exist', async ()=>{
    const test = await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'dfcdfv',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})

it('return a 401 when purchasing an order that does not belong to a user', async ()=>{
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })
    await order.save()
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'dfcdfv',
            orderId: order.id
        })
        .expect(401)
})

it('return a 400 when purchasing an cancelled order', async ()=>{
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    })
    await order.save()
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'dfcdfv',
            orderId: order.id
        })
        .expect(400)
})

// it('returns a 204 with valid inputs [prototype of real charge]', async ()=>{
//     const userId = mongoose.Types.ObjectId().toHexString();
//     const order = Order.build({
//         id: mongoose.Types.ObjectId().toHexString(),
//         userId: userId,
//         version: 0,
//         price: 20,
//         status: OrderStatus.Created
//     })
//     await order.save()

//     await request(app)
//         .post('/api/payments')
//         .set('Cookie', global.signin(userId))
//         .send({
//             token: 'tok_visa',
//             orderId: order.id
//         })
//         .expect(201)
//     const chargedOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
//     expect(chargedOptions.source).toEqual('tok_visa')
//     expect(chargedOptions.currency).toEqual('usd')


// })
it('returns a 204 with valid inputs [realistic example]', async ()=>{
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000)
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: price,
        status: OrderStatus.Created
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201)
    const stripeCharges = await stripe.charges.list({
        limit: 50
    })
    const stripeCharge = stripeCharges.data.find(charge =>{
        return charge.amount === price * 100
    })
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge?.currency).toEqual('usd')

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    })
    expect(payment).not.toBeNull();
})
