const userModel = require("../model/usersModel")

const getAllUsers = async (req, res) => {
    if (req.body.userInfo.role !== "Admin") {
        return res.status(401).json({ success: false, message: "You are not authorized to access this resources" })
    }

    const users = await userModel.find()
    res.status(200).json({ success: true, users })
}

const deleteUser = async (req, res) => {
    const { id } = req.body
    const user = await userModel.findOneAndDelete({ _id: id })

    if (req.body.userInfo.role !== "Admin") {
        return res.status(401).json({ success: false, message: "You are not authorized to access this resources" })
    }
    
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" })
    }

    return res.status(404).json({ success: true, message: "Delete Successful" })

    

}

module.exports = { getAllUsers, deleteUser }