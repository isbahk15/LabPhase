const mongoose = require('mongoose');
const bcrypt = require ('bcryptjs');

const UserSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique: true},
    password:{type:String, required:true},

    //this tells us if they are a consumer or a producer
    role:{type: String, enum: ['processor', 'agribusiness'], default:'processor'}
}, {timestamps:true});

//this middleware makes the passwords hashs and saves to mongo for security so noone steals your password
    UserSchema.pre('save', async function(next) {
        if(!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
        
    });

    module.exports = mongoose.model('User', UserSchema);