import express from 'express'
import { protect } from '../middleware/authmiddleware.js'
import multer from 'multer'
import Userz from '../models/person.js'
import Profiles from '../models/profile.js'
import cloudinaryz from '../middleware/clodinary.js'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
import uploadImage from '../middleware/multer.js'
import { uploads } from '../middleware/clodinary.js'
import fs from 'fs'

dotenv.config()

const profileRouter = express.Router()


//create user profile

profileRouter.route('/create').post( protect , uploadImage.array('image', 5), async (req, res, next) => {

    try {
       
            console.log(req.files)
            const {handle, bio, location} = req.body
            console.log({handle, bio, location})
            console.log(req.user._id)
    
            const uploader = async(path) => await uploads(path, 'Images')
            const urls = []
            if(req.method === 'POST'){
                
                //req.files is an array
                const files = req.files
                
                for(const file of files){
                    const { path } = file
    
                    const newPath = await uploader(path)
                   
                   urls.push(newPath)
    
                   fs.unlinkSync(path)
               }  
                 console.log(urls)
                 console.log({handle, bio, location})
    
                     
               
                 
                 if(!urls[0] && !urls[1]){
                    const pro = await Profiles.create({
                        handle: req.body.handle,
                        bio: req.body.bio,
                        location: req.body.location,
                        profilepics: {
                           url: 'https://res.cloudinary.com/ibeenoch/image/upload/v1670541027/ghgelknzzv5rrchicf5k.png',
                           public_id: 'ghgelknzzv5rrchicf5k',
                       },
                       coverphoto: {
                          url: 'https://res.cloudinary.com/ibeenoch/image/upload/v1670541027/ghgelknzzv5rrchicf5k.png',
                          public_id: 'ghgelknzzv5rrchicf5k',
                      },
                       owner: req.user._id
                    })
                    console.log(pro)
                    const user = await Userz.findById(req.user._id)
                    user.profile.push(pro._id)
                    user.handle = pro.handle
                    user.bio = pro.bio
                   console.log(user.profilepics)
                    user.profilepics.url = pro.profilepics.url
                    user.profilepics.public_id = pro.profilepics.public_id
                    user.coverphoto.url = pro.coverphoto.url
                    user.coverphoto.public_id = pro.coverphoto.public_id
                    await user.save()
                    console.log(user.profilepics)
                    console.log(pro.profilepics)
       
                       res.status(200).json({
                           message: 'profile created',
                          pro,
                          user
                       })
                 }
                    
                 if(urls[0] && urls[1]){
                        const pro = await Profiles.create({
                            handle: req.body.handle,
                            bio: req.body.bio,
                            location: req.body.location,
                            profilepics: {
                               url: urls[0].url,
                               public_id: urls[0].id,
                           },
                           coverphoto: {
                              url: urls[1].url,
                              public_id: urls[1].id,
                          },
                           owner: req.user._id
                        })
                        console.log(pro)
                        const user = await Userz.findById(req.user._id)
                        user.profile.push(pro._id)
                        user.handle = pro.handle
                        user.bio = pro.bio
                       console.log(user.profilepics)
                        user.profilepics.url = pro.profilepics.url
                        user.profilepics.public_id = pro.profilepics.public_id
                        user.coverphoto.url = pro.coverphoto.url
                        user.coverphoto.public_id = pro.coverphoto.public_id
                        await user.save()
                        console.log(user.profilepics)
                        console.log(pro.profilepics)
           
                           res.status(200).json({
                               message: 'profile created',
                              pro,
                              user
                           })
                     }

         
              
            }else{
                res.status(405).json({
                    err: 'image upload not successful',
                    
                })
            }
        
    } catch (error) {
        res.status(500)
        throw new Error(error.stack)
    }
})

//get my profile
profileRouter.route('/me').get( protect, async(req, res) => {
    try {
        const fetchProfile = await Profiles.find({ owner: req.user._id})
console.log(fetchProfile)
        res.status(200).json({
            message: 'others profile fetched',
            fetchProfile,
        })
    } catch (error) {
        res.status(500)
        throw new Error(error)
    }
})

profileRouter.route('/').get(protect, async(req, res) => {
    try {
       const allprofile = await Profiles.find({ owner: { $ne: req.user._id }})
console.log(allprofile)
       res.status(200).json(allprofile)
    } catch (error) {
        res.status(500)
        throw new Error(error) 
    }
}) 


profileRouter.route('/update').put(protect, uploadImage.array('image', 3), async(req, res) => {
    try {
      
            console.log(req.files)
            console.log(req.body)
            const uploader = async(path) => await uploads(path, 'Images')
            const urls = []
            if(req.method === 'PUT'){
                
                //req.files is an array
                const files = req.files
                
                for(const file of files){
                    const { path } = file
    
                    const newPath = await uploader(path)
                   
                   urls.push(newPath)
    
                   fs.unlinkSync(path)
               }  
                 console.log(urls)
    
            const profile = await Profiles.findOne({ owner: req.user._id })
            console.log(profile)
            if(!profile){
                res.status(404)
                throw new Error('profile do not exist')
            }
            
    if(!urls[0] && !urls[1]){
        const updatedProfile = await Profiles.findByIdAndUpdate(profile._id, {
            handle: req.body.handle,
            bio: req.body.bio,
            location: req.body.location,
            profilepics: {
                url: profile.profilepics.url,
                public_id: profile.profilepics.public_id,
            },
            coverphoto: {
                url: profile.coverphoto.url,
                public_id: profile.coverphoto.public_id,
           },
        }, { new: true })

        console.log(updatedProfile)

        const user = await Userz.findById(req.user._id)
        user.handle = updatedProfile.handle
        user.bio = updatedProfile.bio
        user.profilepics.url = updatedProfile.profilepics.url
        user.profilepics.public_id = updatedProfile.profilepics.public_id
        user.coverphoto.url = updatedProfile.coverphoto.url
        user.coverphoto.public_id = updatedProfile.coverphoto.public_id
        await user.save()

        res.status(200).json({
            message: 'profile updated',
            updatedProfile,
        })
    }

    if(urls[0] && urls[1]){
        const updatedProfile = await Profiles.findByIdAndUpdate(profile._id, {
            handle: req.body.handle,
            bio: req.body.bio,
            location: req.body.location,
            profilepics: {
                url: urls[0].url,
                public_id: urls[0].id,
            },
            coverphoto: {
               url: urls[1].url,
               public_id: urls[1].id,
           },
        }, { new: true })

        console.log(updatedProfile)

        const user = await Userz.findById(req.user._id)
        user.handle = updatedProfile.handle
        user.bio = updatedProfile.bio
        user.profilepics.url = updatedProfile.profilepics.url
        user.profilepics.public_id = updatedProfile.profilepics.public_id
        user.coverphoto.url = updatedProfile.coverphoto.url
        user.coverphoto.public_id = updatedProfile.coverphoto.public_id
        await user.save()

        res.status(200).json({
            message: 'profile updated',
            updatedProfile,
        })
    }
           
    
                
        }else{
            res.status(405).json({
                err: 'image upload not sucessful',
                
            })
        }
        
      
    } catch (error) {
        res.status(500)
        throw new Error(error)
    }
})



export default profileRouter
