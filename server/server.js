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

app.get('/books', async (req, res) => {
    console.log("get:books")
    try {
        const books = await pool.query('SELECT * from books ORDER BY book_id')
        res.json(books.rows)
    } catch (err) {
        console.error(err)
    }
})


app.get('/books/:title', async (req, res) => {
    console.log("get:books/title")

    try {
        const { title } = req.params;
        console.log(title)
        const query = 'SELECT * FROM books WHERE title = $1';
        const books = await pool.query(query, [title])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})


app.get('/user/:id', async (req, res) => {
    console.log("get:user/id")

    try {
        const { id } = req.params;
        console.log(id)
        const query = 'SELECT * FROM users WHERE id = $1';
        const books = await pool.query(query, [id])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})
//Update Books API endpoint
//
//Patch Body Format:
//Only REQUIRED Field is "title"
//Blank and NonExisitent fields are ignored  
//
//  {
// "book_id": 1,
// "title": "Classical Mythology",
// "author_id": 1,
// "publisher": "Oxford University Press",
// "isbn": "195153448",
// "publication_year": 2011,
// "genre": "Science Fiction",
// "img": "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
// "count": 5
//  }

app.patch('/books', async (req, res) => {
    const {
        title
    } = req.body
    try {
        const query = 'SELECT * FROM books WHERE title = $1';
        const books = await pool.query(query, [title])
        if (books.rows.length > 0) {

            for (const [key, value] of Object.entries(req.body)) {
                if (key == "book_id" || key == "author_id" || value.length == 0) {

                } else {
                    console.log(books.rows[0][key], value)
                    books.rows[0][key] = value
                }

            }
            const merge = books.rows[0]

            const query = `
            UPDATE books 
            SET 
            publisher=$1,
            isbn=$2,
            publication_year=$3,
            genre=$4,
            img=$5,
            count=$6        
            WHERE title = $7
            `
            const values = [merge.publisher, merge.isbn, merge.publication_year, merge.genre, merge.img, merge.count, merge.title]
            console.log(values)
            const booksupdated = await pool.query(query, values)
            console.log(booksupdated.rows)


            res.status(200).json({
                books: merge,
                message: 'Book Updated',

            });
        } else {
            res.status(500).json({
                message: "Book Not Found",
            });
        }
    } catch (err) {
        console.error(err)
    }
})

app.get('/events', async (req, res) => {
    try {
        // Query the database to retrieve events data
        const queryText = `
        SELECT 
            e.event_id, 
            e.event_name, 
            e.event_date, 
            e.book_id, 
            e.author_id, 
            b.title, 
            a.author_name
        FROM 
            events e
        JOIN 
            books b ON e.book_id = b.book_id
        JOIN 
            author a ON e.author_id = a.author_id
    `; 
        const { rows } = await pool.query(queryText);

        // Send the events data as a response
        res.json(rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.patch('/checkoutbook/:title', async (req, res) => {
    const {
        title
    } = req.body
    console.log("Checking Out:", title)
    

    try {
            const query = `
            UPDATE books 
            SET 
            instock=false
            WHERE title = $1
            `
            const values = [title]
            console.log(values)
            const booksupdated = await pool.query(query, values)
            console.log(booksupdated.rows)


            res.status(200).json({
                books: title,
                message: 'Book Checked Out',

            });
         
    } catch (err) {
        res.status(500).json({
            books: title,
            message: 'Book Error:' + err,

        })
        console.error(err)
    }
})

app.patch('/returnbook/:title', async (req, res) => {
    const {
        title
    } = req.body
    console.log("Returning Book", title)
    

    try {
            const query = `
            UPDATE books 
            SET 
            instock=true
            WHERE title = $1
            `
            const values = [title]
            console.log(values)
            const booksupdated = await pool.query(query, values)
            console.log(booksupdated.rows)


            res.status(200).json({
                books: title,
                message: 'Book Returned',

            });
         
    } catch (err) {
        res.status(500).json({
            books: title,
            message: 'Book Error:' + err,

        })
        console.error(err)
    }
})


app.post("/signup", async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        role
    } = req.body;

    try {
        // Check if user already exists
        const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
        const existingUserResult = await pool.query(existingUserQuery, [email]);

        if (existingUserResult.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);



        // Insert new user into the database
        const insertUserQuery = 'INSERT INTO users( firstName, lastName, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const insertedUserResult = await pool.query(insertUserQuery, [firstName, lastName, email, hashedPassword, role]);

        const newUser = insertedUserResult.rows[0];

        let loginData = {
            email: newUser.email,
            role: newUser.role,
            signInTime: Date.now(),
        };

        const token = jwt.sign(loginData, jwtSecretKey);
        res.status(200).json({
            message: "success",
            token,
            role: user.role
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Login endpoint (similar changes as in the previous example)
app.post("/login", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const getUserQuery = 'SELECT * FROM users WHERE email = $1';
        const userResult = await pool.query(getUserQuery, [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        let loginData = {
            email: user.email,
            role: user.role,
            signInTime: Date.now(),
        };

        const token = jwt.sign(loginData, jwtSecretKey);
        res.status(200).json({
            message: "success",
            token,
            role: user.role
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            message: "Internal server error"
        });
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
                .json({
                    status: "logged in",
                    message: "success"
                });
        } else {
            // Access Denied
            return res.status(401).json({
                status: "invalid auth",
                message: "error"
            });
        }
    } catch (error) {
        // Access Denied
        return res.status(401).json({
            status: "invalid auth",
            message: "error"
        });
    }

})

app.post('/check-account', async (req, res) => {
    try {
        const {
            email
        } = req.body;

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
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

app.post('/book_insert', async (req,res) => {

    const {title, author_id, publisher, isbn, publication_year, genre, img, count , instock} = req.body;
    try {
        const queryResult =
            // Search for the isbn
            await pool.query('SELECT isbn FROM books WHERE isbn = $1', [isbn]);

            const id_count = await pool.query('SELECT COUNT(*) FROM books');
            let rowCount = parseInt(id_count.rows[0].count);
            rowCount+=1;

        // If the result of the query is null, insert book
        if (queryResult.rows.length === 0) {
            const insert_query
                = await pool.query('INSERT INTO books (book_id, title, author_id, publisher, isbn, publication_year, genre, img, count, instock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                [rowCount, title, author_id, publisher, isbn, publication_year, genre, img, count, instock]);

                

            // 200 Message
            return res.status(200).json({
                message: 'A new book has been added.'
            });
        }
        else {
            // Update the count for the existing book
            await pool.query(
                'UPDATE books SET count = count + $1 WHERE isbn = $2',
                [count, isbn]
            );
            // Send response indicating the book already exists
            return res.status(409).json({
                message: 'Book with the same ISBN already exists.'
            });
        }
    }
    catch (error) {
        console.error("Error adding book:", error);
    return res.status(500).json({
        message: 'An error occurred while adding the book.'
    });
    }
});

app.delete('/book_delete', async (req,res) => {

    const {isbn} = req.body;
    try {
        const queryResult =
            // Search for the isbn.
            await pool.query('SELECT isbn FROM books WHERE isbn = $1', [isbn]);

        // If the isbn is in the DB, delete book.
        if (queryResult.rows.length > 0) {
            const delete_query
                = await pool.query('DELETE FROM books WHERE isbn = $1', [isbn]);

            // 200 Message
            return res.status(200).json({
                message: 'THe book has been deleted.'
            });
        }
        else {
            // Send response indicating the book not in DB.
            return res.status(404).json({
                message: 'This book is not in the database.'
            });
        }
    }
    catch (error) {
        console.error("Error deleting book:", error);
    return res.status(500).json({
        message: 'An error occurred while deleting the book.'
    });
    }
});

app.post('/event_insert', async (req,res) => {

    const {event_name, event_date, book_id, author_id} = req.body;
    try {
        const id_count = await pool.query('SELECT COUNT(*) FROM events');
            let rowCount = parseInt(id_count.rows[0].count);
            rowCount+=1;

        const insert_query
            = await pool.query('INSERT INTO events (event_id, event_name, event_date, book_id, author_id) VALUES ($1, $2, $3, $4, $5)',
            [rowCount, event_name, event_date, book_id, author_id]);

        // 200 Message
        return res.status(200).json({
            message: 'A new event has been added.'
        });
    }
    catch (error) {
        console.error("Error adding event:", error);
        return res.status(500).json({
            message: 'An error occurred while adding the event.'
    });
    }
});


app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))
