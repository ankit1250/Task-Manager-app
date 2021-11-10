const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const taskRouter = require('./routers/task')
const auth = require('./middleware/auth')

const app = express()
const port  = process.env.PORT|3000

// app.use((req,res,next)=>{
//     res.status(503).send("The site is under maintenance!! Sorry for the incovenience caused. Please try after sometime")
// })

app.use(express.json())
app.use(taskRouter)


app.post('/users',async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    // user.save().then(()=>{
    //     res.send(user)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })   
})
app.post('/users/login',async (req,res)=>{
    try{
       
       const user = await User.findByCredentials(req.body.email,req.body.password)
       const token = await user.generateAuthToken()
       res.send({user,token})
    }catch(e){
       res.status(404).send(e)
    }
})

app.post('/users/logout',auth,async (req,res)=>{
    try{
      req.user.tokens = req.user.tokens.filter((token)=>{
          return token.token !== req.token
      })

      await req.user.save()
      res.send("You have been logged out successfully!")
    }catch(e){
      res.status(503).send()
    }
})

//logout of all devices
app.post('/users/logoutall',auth,async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send('Logout Failed')
    }
})


app.get('/users/me',auth,async (req,res)=>{
    try{
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((err)=>{
    //     res.status(500).send(err)
    // })
})

app.get('/users/:id',async (req,res)=>{
    const _id = req.params.id

    try{
        const user= await User.findById(_id)
        if(!user){
           return res.status(400).send("User not found with given id")
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(400).send("User not found!")
    //     }
    //     res.send(user)
    // }).catch((err)=>{
    //     res.status(500).send(err)
    // })
})

app.patch('/users/:id',async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send("Error: Invalid update")
    }

    try{
        const user = await User.findById(req.params.id)

        updates.forEach((update)=> user[update]= req.body[update])

        await user.save()
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!user){
            return res.status(404).send("User update failed")
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

app.delete('/users/:id',async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(err){
        res.status(500).send(err)
    }
})

app.listen(port,()=>{
    console.log("server is up on the port ",port)
})

// const jwt= require('jsonwebtoken')
// const myFunction = async ()=>{
//     //creating web token
//     const token = jwt.sign({_id:'abcd1234'},'thisisasecretkey',{expiresIn:'1h'})
//     console.log(token)
//     const data = jwt.verify(token,'thisisasecretkey')
//     console.log(data)
// }


// myFunction()