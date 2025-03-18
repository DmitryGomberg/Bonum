const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/user.controller');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello world");
});


app.use('/api', userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});