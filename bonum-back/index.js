const express = require('express');

const PORT = process.env.PORT || 8080

const app = express()

app.listen(PORT, ()=>{console.log(`Сервер запущен на ${PORT} порту`)})