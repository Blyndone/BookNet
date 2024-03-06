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

  app.post("/signup", async (req, res) => {
    const { firstName , lastName , email, password, role} = req.body;

    try {
        // Check if user already exists
        const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
        const existingUserResult = await pool.query(existingUserQuery, [email]);

        if (existingUserResult.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        

        // Insert new user into the database
        const insertUserQuery = 'INSERT INTO users( firstName, lastName, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const insertedUserResult = await pool.query(insertUserQuery, [firstName, lastName, email, hashedPassword, role]);

        const newUser = insertedUserResult.rows[0];

        let loginData = {
            email: newUser.email,
            signInTime: Date.now(),
        };

        const token = jwt.sign(loginData, jwtSecretKey);
        res.status(200).json({ message: "success", token });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login endpoint (similar changes as in the previous example)
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const getUserQuery = 'SELECT * FROM users WHERE email = $1';
        const userResult = await pool.query(getUserQuery, [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        let loginData = {
            email: user.email,
            signInTime: Date.now(),
        };

        const token = jwt.sign(loginData, jwtSecretKey);
        res.status(200).json({ message: "success", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
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

app.post('/check-account', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists in the database
        const getUserQuery = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(getUserQuery, [email]);

        const user = result.rows;

        console.log(user);

        res.status(200).json({
            status: user.length === 1 ? "User exists" : "User does not exist",
            userExists: user.length === 1,
        });
    } catch (error) {
        console.error("Error checking account:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});


app.listen(PORT, ()=> console.log(`Server running on Port ${PORT}`))