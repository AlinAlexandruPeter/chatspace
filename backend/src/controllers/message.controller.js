import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"

export const getSidebarUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getSidebarUsers controller ", error.messaage)
        res.status(500).json({ message: "Internal server error", })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: targetUserId } = req.params
        const senderId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: senderId }
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller ", error.messaage)
        res.status(500).json({ message: "Internal server error", })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id:targetUserId } = req.params
        const senderId = req.user._id

        let imageUrl
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId: targetUserId,
            text,
            image: imageUrl
        })

        await newMessage.save()
        const receiverSocketId = getReceiverSocketId(targetUserId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller ", error)
        res.status(500).json({ message: "Internal server error", })
    }
}