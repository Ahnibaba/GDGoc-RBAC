require("dotenv").config()
const express = require("express")
const connectDB = require("./config/db")
const authRouter = require("./routes/authRoute")
const usersRouter = require("./routes/usersRoute")
const cors = require("cors")


const PORT = 4002

connectDB()



const app = express()

app.use(cors({
    origin: "frontend url",
    credentials: true
 }))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use("/auth", authRouter)
app.use("/users", usersRouter)


app.listen(PORT, ()  => {
    console.log(`Server started at http://localhost:${PORT}`);
    
})