import mongoose from 'mongoose'
import Userz from './person.js';
import Posta from './post.js';

 
const profilesSchema = mongoose.Schema({
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
    location: {
        type: String,
        default: 'the Earth'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userz',
    },
}, {
    timestamps: true
})

const Profiles = mongoose.model('Profiles', profilesSchema)

export default Profiles;
