const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})



// const newTask = new Task({
//     description: "Shopping for Diwali",
//     completed: true
// })

// newTask.save().then(()=>{
//     console.log(newTask)
// }).catch((error)=>{
//     console.log(error)
// })


