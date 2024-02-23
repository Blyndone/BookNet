const PORT = process.env.PORT ?? 3006
const express = require('express')

const app = express()
const pool = require('./db')

app.get('/', (req, res) => {
    res.send("HEYY JESSSSEE!!!")
})

app.get('/books', async(req,res) => {
    try{
        const books = await pool.query('SELECT * from book')
        res.json(books.rows)
    }catch (err) {
        console.error(err)
    }
})

app.listen(PORT, ()=> console.log(`Server running on Port ${PORT}`))