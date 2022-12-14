import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Userz from './person.js'

const postsSchema = new mongoose.Schema({
post: String,
img: {
    url: String,
    public_id: String,
},
owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Userz'
},
likes: [
     {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Userz'
}
],
comments: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Userz'
        },    
        comment: {
            type: String,
            required: true
        },
    }
]
},{
    timestamps: true,
})

const Posta = mongoose.model('Posta', postsSchema)

export default Posta;
