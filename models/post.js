import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from './person.js'

const postSchema = new mongoose.Schema({
post: String,
img: {
    url: String,
    public_id: String,
},
owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
likes: [
     {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}
],
comments: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
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

const Post = mongoose.model('Post', postSchema)

export default Post;
