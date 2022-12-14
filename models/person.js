import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    posts:[
           {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Posta'
       }
   ],
   profile:{
     type: [ {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Profiles'
} ],
validate: [(val) => val.length <= 1, 'only one profile need'],
},
   followers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
],
following: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
],
handle: {
    type: String,
},
bio: String,
profilepics:  {
    url: String,
    public_id: String,
},
coverphoto: {
    url: String,
    public_id: String,
},
},{
    timestamps: true,
})
const User = mongoose.model('User', userSchema)

export default User;
