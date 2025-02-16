const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
const connectDb = require('./config/db')
const authRouter = require('./routes/authRoute')
const postRouter = require('./routes/postRoute')
const userRouter = require('./routes/userRoute')

const app = express()
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}
app.use(cors(corsOptions))

connectDb()

//api routes
app.use('/auth', authRouter)
app.use('/users', postRouter)
app.use('/users', userRouter)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`server listening on ${PORT}`))
