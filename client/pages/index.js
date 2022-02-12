// import buildClient from "../api/builtClient";
import Link from "next/link";

const LandingPage = ({currentUser, tickets}) =>{
    const ticketList = ticket.map(ticket =>{
        return(<tr>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
            <td>
                <Link href="/tickets/[ticketId]" as = {`/tickets/${ticket.id}`}>
                    <a>View</a>
                </Link>
            </td>
        </tr>)
    })

    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                    </tr>
                </thead>
                    <tbody>
                        {ticketList}
                    </tbody>
            </table>
        </div>
    );
}

LandingPage.getInitialProps = async (context, client, currentUser)=>{
    // const client = buildClient(context)
    // const {data} =  await client.get('/api/users/currentuser')
    // return data;
    const {data} = await client.get('/api/tickets')
    return {tickets: data};
}

export default LandingPage



// if (typeof window === 'undefined'){
//     // console.log(req.headers)
//     const {data} = await axios
//     .get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
//         headers: req.headers
//     });
//     return data;
// } else {
//     console.log(1)
//     const {data} = await axios.get('/api/users/currentuser')
//     return data;
// }