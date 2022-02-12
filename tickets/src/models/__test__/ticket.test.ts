import { Ticket } from "../ticket";


it('implements optimistic concurrency control', async ()=>{
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123'
    })
    // Save ticket to the dtabase
    await ticket.save()
    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);
    // Make 2 separate changes to the ticket we fetched
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15})
    // save the first fetched ticket
    await firstInstance!.save()
    // save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
      } catch (error){
        const result = (error as Error).message
        console.log(result)
        return ;
      }  
    // expect(()=>{
    //   await secondInstance!.save();
    // }).toThrow();
  throw new Error('Should not reach this point')
})

it('increments the version number on multiple saves', async()=>{
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123'
  })
  await ticket.save()
  expect(ticket.version).toEqual(0);
  await ticket.save()
  expect(ticket.version).toEqual(1);
})