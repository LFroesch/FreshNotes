// backend/src/controllers/profileController.js
import { User } from "../models/User.js";

export async function getMyProfile(req, res) {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        console.log("Error in getMyProfile controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function updateProfile(req, res) {
    try {
        const { username, email, bio } = req.body;
        
        if (bio && bio.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Bio must be less than 500 characters"
            });
        }

        // Check if username or email already exists (excluding current user)
        if (username) {
            const existingUsername = await User.findOne({ 
                username: username, 
                _id: { $ne: req.user._id } 
            });
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists"
                });
            }
        }

        if (email) {
            const existingEmail = await User.findOne({ 
                email: email, 
                _id: { $ne: req.user._id } 
            });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (bio !== undefined) updateData.bio = bio;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            user: user,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.log("Error in updateProfile controller: ", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}