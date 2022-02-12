import express from 'express';
import { currentUser } from '@smax_ticketing/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser,  (req, res)=>{
    // if(!req.session?.jwt){
    //     return res.send({currentUser: null})
    // }

    res.send({currentUser: req.currentUser || null})
    // try{
    //     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    //     res.send({currentUser: payload})
    // } catch(e){
    //     res.send({currentUser: null})
    // }
})

export {router as currentUserRouter};