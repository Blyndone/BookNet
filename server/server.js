const PORT = process.env.PORT ?? 3006
const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var cors = require('cors')
const app = express()
const pool = require('./db')

app.use(cors())
app.use(express.json())

const jwtSecretKey = process.env.JWT_KEY

app.get('/', (req, res) => {
    res.send("HEYY JESSSSEE!!")
})

app.get('/books', async(req,res) => {
    try{
        const books = await pool.query('SELECT * from books')
        res.json(books.rows)
    }catch (err) {
        console.error(err)
    }
})

app.post('/auth', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Look up the user entry in the database
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
      // If found, compare the hashed passwords and generate the JWT token for the user
      if (result.rows.length === 1) {
        const user = result.rows[0];
        bcrypt.compare(password, user.password, function (_err, result) {
          if (!result) {
            return res.status(401).json({ message: 'Invalid password' });
          } else {
            let loginData = {
              email,
              signInTime: Date.now(),
            };
  
            const token = jwt.sign(loginData, jwtSecretKey);
            res.status(200).json({ message: 'success', token });
          }
        });
      } else {
        // If no user is found, hash the given password and create a new entry in the auth db with the email and hashed password
        bcrypt.hash(password, 10, async function (_err, hash) {
          const insertQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
          const result = await pool.query(insertQuery, [email, hash]);
  
          let loginData = {
            email,
            signInTime: Date.now(),
          };
  
          const token = jwt.sign(loginData, jwtSecretKey);
          res.status(200).json({ message: 'success', token });
        });
      }
    } catch (error) {
      console.error('Error executing SQL query', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // The verify endpoint that checks if a given JWT token is valid
app.post('/verify', (req, res) => {
    const tokenHeaderKey = "jwt-token";
    const authToken = req.headers[tokenHeaderKey];
    try {
      const verified = jwt.verify(authToken, jwtSecretKey);
      if (verified) {
        return res
          .status(200)
          .json({ status: "logged in", message: "success" });
      } else {
        // Access Denied
        return res.status(401).json({ status: "invalid auth", message: "error" });
      }
    } catch (error) {
      // Access Denied
      return res.status(401).json({ status: "invalid auth", message: "error" });
    }

})

app.post('/check-account', (req, res) => {
    const { email } = req.body

    console.log(req.body)

    const user = db.get("users").value().filter(user => email === user.email)

    console.log(user)
    
    res.status(200).json({
        status: user.length === 1 ? "User exists" : "User does not exist", userExists: user.length === 1
    })
})


app.listen(PORT, ()=> console.log(`Server running on Port ${PORT}`))