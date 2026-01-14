const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const registerUser = async (req,res) => {
    const {name,email,password,role,department,Lab} = req.body;

    try{
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });
        const hashPassword = await bcrypt.hash(password,10);
        const user = await User.create({name,email,password: hashPassword,role,department,Lab});

        res.status(201).json({
            _id : user._id,
            name: user.name,
            email: user.email,
            role : user.role,
            department: user.department,
            Lab: user.Lab,
            token: generateToken(user)
        })
    } 
    catch(error){
        res.status(500).json({message:"Server Error"})
    }
};

const loginUser = async (req,res) => {
    const {email,password} = req.body;

    try{
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        
        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        res.json({
            _id : user._id,
            name: user.name,
            email: user.email,
            role : user.role,
            department: user.department,
            Lab: user.Lab,
            token: generateToken(user)
        });
    } catch(error){
        res.status(500).json({message:"Server Error"});
    }
};

module.exports = {registerUser,loginUser};