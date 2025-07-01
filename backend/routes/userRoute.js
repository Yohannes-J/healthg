import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, registerUser, updateProfile } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

// Route to register user
userRouter.post('/register', registerUser)

// Route to login user
userRouter.post('/login', loginUser)

// Route to get user profile, requires authentication
userRouter.get('/get-profile', authUser, getProfile)

// Route to update user profile, requires authentication and file upload
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)


userRouter.post('/book-appointment', authUser, bookAppointment)

userRouter.get('/appointments', authUser, listAppointment)

userRouter.post('/cancel-appointment', authUser, cancelAppointment)


export default userRouter
