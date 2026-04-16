import User from "../models/User.js";
import Resume from "../models/Resume.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}

export const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({error: "Please fill all the fields"})
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({error: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({
            message: 'User created successfully',
            user: newUser,
            token
        })  

    } catch (error) {
        return res.status(400).json({message: error.message})

    }
}

// login


export const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Please fill all the fields"})
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Invalid credentials"})
        }
        
        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).json({message: "Invalid credentials"})
        }
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({
            message: 'User logged in successfully',
            user,
            token
        })

    } catch (error) {
        return res.status(400).json({message: error.message})

    }
}

// GET: /api/users/data
export const getUserById = async (req, res) => {
    try{
        const userId = req.userId; 
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        user.password = undefined;
         return res.status(200).json({user})

        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}    

// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
    try{
        const userId = req.userId;
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}