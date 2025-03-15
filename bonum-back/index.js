const express = require('express');
const userRouter = require('./routes/user.controller')
const PORT = process.env.PORT || 8080

const cors = require("cors");

const app = express()

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.use(cors());
app.use(express.json())
app.use('/api', userRouter)

app.listen(PORT, ()=>{console.log(`Сервер запущен на ${PORT} порту`)})