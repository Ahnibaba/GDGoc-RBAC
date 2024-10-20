const userModel = require("../model/usersModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const register = async (req, res) => {
    const { name, email, role, password } = req.body

    try {
        if (!name || !email || !role || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
    
        
        const duplicate = await userModel.findOne({ email })
    
        if (duplicate) {
            return res.status(400).json({ success: false, message: "User already exists" }) 
        }
        
    
        if (password < 8) {
            return res.status(400).json({ success: false, message: "Enter a strong password" }) 
        }
        
    
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const newUser = new userModel({
            name: name,
            email: email,
            role: role,
            password: hashedPassword
        })
        
        const user = await newUser.save()
    
        
        res.status(201).json({ success: true, message: "Successfully registered" })
    
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: true, message: "registration failed" })
    }



}

const login = async (req, res) => {
    const { email, password } = req.body

    console.log(email, password);
    
    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" })
        }

        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(401).json({ success: false, message: "Enter a valid password" })
        }

        const accessToken = jwt.sign(
            {userInfo:{ id: user._id, role: user.role }},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60s" }
        )
        const refreshToken = jwt.sign(
            {userInfo:{ id: user._id, role: user.role }},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "2m" }
        )
    
        res.cookie('accessToken', accessToken, {
            maxAge: 1 * 60 * 1000,
            httpOnly: true,
            //secure: true, // cookie will be sent only over HTTPS
            //sameSite: "none"
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 2 * 60 * 1000, 
            httpOnly: true,
            //secure: true, // cookie will be sent only over HTTPS
            //sameSite: "none"
        });
    
        res.status(200).json({ success: true, message: "Successfully logged in", accessToken })
        


    } catch(err) {
        console.log(err);
        res.status(400).json({ success: false, message: "Login failed" })
    }
}



module.exports = { register, login }