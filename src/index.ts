import express from 'express'
import https from 'https'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
const db_password = process.env.DB_PASSWORD
const MONGO_URL =`mongodb+srv://ganeshmaharaj444:${db_password}@cluster0.p0hmk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
import mongoose, { Promise } from 'mongoose'
import router from './router'


mongoose.Promise = Promise
mongoose.connect(MONGO_URL).then(()=>{
    console.log("Connection Successful")
})
mongoose.connection.on('error',(err:Error)=>{
    console.log(err)
})

const app = express()

app.use(cors({
    credentials: true,
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = https.createServer(app)

app.use('/',router())











server.listen(4004,()=>{
    console.log("server 4004")
})