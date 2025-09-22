import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup  = async (req , res) => {
    const { name, email, password } = req.body
    try {
        if (!name || !email || !password) {
            return res.status(400).send("All fields are required")
        }

        if (password.length < 6) {
            return res.status(400).send("Password must be at least 6 characters")
        }   

        const user  = await User.findOne({email})
        if (user) return res.status(400).json({ messaage: "User already exists" })
        
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPass,
        })

        if (newUser) { 
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({ message: "User created successfully" })
        } else {
            console.log("Error in signup controller ", error.messaage)
            res.status(500).json({ message: "Internal server error", })
        }
        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            profilePic: user.profilePic
        })
    } catch (error) {
        
    }
}

export const login = async (req , res) => {
    const { email, password } = req.body

    try {
        const user  = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ messaage: "Invalid Credentials" })
        }

        const isPasscorrect = await bcrypt.compare(password, user.password)
        if (!isPasscorrect) {
            return res.status(400).json({ messaage: "Invalid Credentials" })
        } else {
            generateToken(user._id, res)
            res.status(200).json({
                _id: user._id,
                email: user.email,
                name: user.name,
                profilePic: user.profilePic
            })
        }

    } catch (error) {
        console.log("Error in login controller ", error.messaage)
        res.status(500).json({ message: "Internal server error", })
    }
    res.send("Signup")
}

export const logout = async (req , res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log9("Error in logout controller ", error.messaage)
        res.status(500).json({ message: "Internal server error", })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId =req.user._id

        if(!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" })
        }
        
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, { new: true })

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Eror in updateProfile controller ", error)
        res.status(500).json({ message: "Internal server error", })
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller ", error.messaage)
        res.status(500).json({ message: "Internal server error", })
    }
}