require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const app = express();  

app.use(express.json());
app.use(cors({
    origin: 'https://code-campus-rho.vercel.app',
    credentials: true,
    methods: ['GET', 'POST','PUT', 'OPTIONS','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.options('/api/v2/execute', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send();
});


const authRoutes = require("./routes/authRoutes"); 
app.use("/api/auth", authRoutes); 

const userRoute = require("./routes/userRoute");
app.use("/api",userRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CodeCampus Backend is running 🚀"
  });
});

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)
.then(()=> app.listen(PORT,()=>console.log("Server running successfully..")))
.catch((err)=>console.log(err));

mongoose.connection.on("error", (err) => {
    console.error("MongoDB Connection Error:", err);
});
