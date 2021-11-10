require('../src/db/mongoose')
const Task = require("../src/models/task")

// Task.findByIdAndDelete("6182544ef83fcb3f90d503cc").then((result)=>{
//     console.log(result)
//     return Task.countDocuments({completed:false})
// }).then((count)=>{
//    console.log(count)
// }).catch((err)=>{
//     console.log(err)
// })

const deleteAndCountTask = async (id)=>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteAndCountTask("6184bdd44bf7be638665ccb3").then((count)=>{
    console.log(count)
}).catch((err)=>{
    console.log(err)
})