const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim:true,
        default: "anonymous"
    },
    email: {
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!!')
            }
        } 
    },
    password:{
       type: String,
       required:true,
       minlength: 7,
       trim: true,
       validate(value){
           if(value.toLowerCase().includes('password')){
               throw new Error('Password cannot contain "password"')
           }
       }
    },
    age: {
        type:Number,
        default: 0,
        required:true
    },
    tokens: [{
        token:{
            type:String,
            required:true
        }
    }]
 })

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'thisisasecretkey')
    user.tokens = user.tokens.concat({token})
    await user.save()   
    return token
}

userSchema.statics.findByCredentials = async (email,password)=>{
    
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save',async function (next){
   const user =this
   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password,8)
   }
   next()
})

const User = mongoose.model('User',userSchema)

 // const me = new User({
//     name: '   Anupama',
//     email: " Anumapama@gmail.com",
//     age: 20,
//     password: "phone231!2"
// })

// me.save().then(()=>{
//     console.log(me)
// }).then((error)=>{
//     console.log("Error: ",error);
// })

 module.exports = User