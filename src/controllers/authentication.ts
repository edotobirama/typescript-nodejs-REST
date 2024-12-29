import express from 'express'
// import dotenv from'dotenv'
// dotenv.config()
// const {}

import {authentication, random} from '../helpers'

import { createUser, getUsersByEmail } from '../db/users'

export const login = async(req: express.Request, res: express.Response)=>{
    try{
        const{email,password} = req.body
        
        if(!email||!password){
            return res.sendStatus(400)
        }

        const user = await (await getUsersByEmail(email).select('+authentication.salt +authentication.password'))
        if(!user){
            return res.sendStatus(400)
        }

        const expectedHash = authentication(user.authentication.salt,password)
    
        if(user.authentication.password !== expectedHash){
            res.sendStatus(400)
        }

        const salt = random()
        user.authentication.sessionToken = authentication(salt,user._id.toString())

        await user.save()

        res.cookie(`GM-AUTH`,user.authentication.sessionToken,{
            domain:'localhost',
            path:'/'
        })
        return res.status(100).json({user}).end()
    }
    catch(error){
        console.log(error)
        res.sendStatus(400)
    }
}


export const register = async(req:express.Request,res:express.Response)=>{
    try{
        const {email,password,username} = req.body
        if(!email||!password||!username) return res.sendStatus(400)
        
        const existingUser = await getUsersByEmail(email)
        if(existingUser) {
            return res.sendStatus(400)
        }
        const salt = random()
        const User = await createUser({
            email,
            username,
            authentication:{
                salt,
                password: authentication(salt,password),
            }
        })
        return res.status(200).json({User}).end()
    }
    catch(error){
        console.log(error)
        return res.sendStatus(400)
    }
}