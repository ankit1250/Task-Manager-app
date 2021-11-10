const Task = require("../models/task")
const express = require('express')

const router = new express.Router();


router.post('/tasks',async (req,res)=>{
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send(e)
    }
    // task.save().then(()=>{
    //     res.send(task)
    // }).catch((error)=>{
    //     res.send(error)
    // })
})

router.get('/tasks',async (req,res)=>{

    try{
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((error)=>{
    //     res.status(500).send(error)
    // })
})

router.get('/tasks/:id',async (req,res)=>{
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(400).send("Task not found")
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(400).send("Task not found")
    //     }
    //     res.send(task)
    // }).catch((err)=>{
    //     res.status(500).send(err)
    // })
})

router.patch('/tasks/:id',async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    
    if(!isValidOperation){
        return res.status(404).send("Error: Invalid Update")
    }


    try{
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            return res.status(404).send("Task update failed")
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})




module.exports = router