import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser'
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signIn';
import { signupRouter } from './routes/signUp';
import { signoutRouter } from './routes/signOut';
import { errorHandler, NotFoundError } from '@smax_ticketing/common';

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.all('*', async ()=>{
  throw new NotFoundError();
})
// app.get('/api/users/current_user', (req, res)=>{
//   res.send('Hi there!')
// })
app.use(errorHandler)

export {app}
