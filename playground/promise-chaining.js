require("../src/db/mongoose")
const User = require("../src/models/user")


//6184bf669949295a4586aa14

// User.findByIdAndUpdate('6184bf669949295a4586aa14',{age:22}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:22})
// }).then((result)=>{
//     console.log(result)
// })

const updateAgeAndCount = async (id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age:age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('6184bf669949295a4586aa14',20).then((count)=>{
    console.log(count)
}).catch((err)=>{
    console.log(err)
})
