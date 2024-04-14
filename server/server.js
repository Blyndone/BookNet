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

        const books = await pool.query('SELECT * from testbooks ORDER BY book_id')
        res.json(books.rows)
        // console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})


app.get('/books/query/', async (req, res) => {
    console.log("get:books/query")


    let { query, limit, offset } = req.query
    console.log("params", query, limit, offset)
    if (query.length <= 0){
        query = '.*'
    }
    // params = new URLSearchParams(decodeURI(req.params.query))
    // let query = params.entries()
    // console.log(query.next().value.query)


    try {

        const querystring = 'SELECT count(S.instock) as stockcount, B.*, A.* FROM (testbooks B Join testauthors A ON B.author = A.id) JOIN teststock S on B.book_id = S.book_id   WHERE title ~* $1  group by B.book_id, A.id order by B.book_id Limit $2 Offset $3 ';
        const books = await pool.query(querystring, [query, limit, offset])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})

///================================================================================================
app.get('/books/bookbuddy/', async (req, res) => {
    console.log("get:books/bookbuddy")


    let { userid, offset } = req.query
    console.log("params", userid)
    if (userid.length <= 0){
        userid = '.*'
    }
    // params = new URLSearchParams(decodeURI(req.params.query))
    // let query = params.entries()
    // console.log(query.next().value.query)


    try {

        const querystring = `WITH
        USER2 (UCOUNT, U2ID, U1ID) AS (
            SELECT
                COUNT(U1.ID),
                U2.ID,
                U1.ID
            FROM
                TESTUSERS U1
                JOIN TESTRESERVATIONS R1 ON U1.ID = R1.USER_ID
                JOIN TESTRESERVATIONS R2 ON R1.BOOK_ID = R2.BOOK_ID
                JOIN TESTUSERS U2 ON R2.USER_ID = U2.ID
            WHERE
                U1.ID = $1
                AND U1.ID <> U2.ID
            GROUP BY
                U2.ID,
                U1.ID
            ORDER BY
                COUNT DESC
            LIMIT
                1
        )
    SELECT DISTINCT
        B.*,
        COUNT(S.INSTOCK) AS STOCKCOUNT,
        A.AUTHOR_NAME
    FROM
        TESTBOOKS B
        JOIN TESTAUTHORS A ON B.AUTHOR = A.ID
        JOIN TESTSTOCK S ON B.BOOK_ID = S.BOOK_ID
    WHERE
        B.BOOK_ID IN (
            SELECT
                BOOK_ID
            FROM
                TESTRESERVATIONS R1
                JOIN USER2 ON R1.USER_ID = USER2.U2ID
            EXCEPT
            SELECT
                BOOK_ID
            FROM
                TESTRESERVATIONS R2
                JOIN USER2 ON R2.USER_ID = USER2.U1ID
        ) 
    GROUP BY
        B.BOOK_ID,
        A.AUTHOR_NAME
    ORDER BY
        CHECKOUT_COUNT DESC
    LIMIT
        5
    OFFSET
        $2`;
        const books = await pool.query(querystring, [userid, offset])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})
///=====================================================================================================
///================================================================================================
app.get('/books/popgenre/', async (req, res) => {
    console.log("get:books/popgenre")


    let { userid, offset } = req.query
    console.log("params", userid)
    if (userid.length <= 0){
        userid = '.*'
    }
    // params = new URLSearchParams(decodeURI(req.params.query))
    // let query = params.entries()
    // console.log(query.next().value.query)


    try {

        const querystring = `
        WITH
	TOPGENRES (GCOUNT, TGENRES, U1ID) AS (
		SELECT
			COUNT(U.ID),
			B.GENRE,
			U.ID
		FROM
			TESTUSERS U
			JOIN TESTRESERVATIONS R ON U.ID = R.USER_ID
			JOIN TESTBOOKS B ON B.BOOK_ID = R.BOOK_ID
		WHERE
			U.ID = $1
		GROUP BY
			B.GENRE,
			U.ID
		ORDER BY
			COUNT DESC
		LIMIT
			4
	),
	NOTREAD (BOOKS) AS (
		SELECT
			BOOK_ID
		FROM
			TESTBOOKS B
			JOIN TOPGENRES G ON B.GENRE = G.TGENRES
		EXCEPT
		(
			SELECT
				BOOK_ID
			FROM
				TESTRESERVATIONS R
				JOIN TESTUSERS U ON U.ID = R.USER_ID
			WHERE
				U.ID = $2
		)
	)
SELECT DISTINCT
	B1.*,
	COUNT(S.INSTOCK) AS STOCKCOUNT,
	A.AUTHOR_NAME
FROM
	TESTBOOKS B1
	JOIN NOTREAD B2 ON B1.BOOK_ID = B2.BOOKS
	JOIN TESTAUTHORS A ON B1.AUTHOR = A.ID
	JOIN TESTSTOCK S ON B1.BOOK_ID = S.BOOK_ID
GROUP BY
	B1.BOOK_ID,
	A.AUTHOR_NAME
ORDER BY
	CHECKOUT_COUNT DESC
LIMIT
	5
OFFSET
	$3
    `;
        const books = await pool.query(querystring, [userid,userid,offset])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})
///=====================================================================================================

// ==========================

app.get('/books/stock/', async (req, res) => {
    console.log("get:books/stock")


    let { query } = req.query
    console.log("params", query)
    if (query.length <= 0){
        query = '.*'
    }
    // params = new URLSearchParams(decodeURI(req.params.query))
    // let query = params.entries()
    // console.log(query.next().value.query)



    try {

        const querystring = 'Select * from testbooks B join teststock S on B.book_id = S.book_id where S.id = $1 ';
        const books = await pool.query(querystring, [query])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})
//============================




app.get('/books/index/', async (req, res) => {
    console.log("get:books/index")


    let { query, limit, offset } = req.query
    console.log("params", query, limit, offset)
    if (query.length <= 0){
        query = '.*'
    }
    // params = new URLSearchParams(decodeURI(req.params.query))
    // let query = params.entries()
    // console.log(query.next().value.query)


    try {

        const querystring = 'SELECT count(S.instock) as stockcount, B.*, A.* FROM (testbooks B Join testauthors A ON B.author = A.id) JOIN teststock S on B.book_id = S.book_id   WHERE S.id= $1  group by B.book_id, A.id order by B.book_id Limit $2 Offset $3 ';
        const books = await pool.query(querystring, [query, limit, offset])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})
// app.get('/books/:index', async (req, res) => {
//     console.log("get:books/index")
//     params = new URLSearchParams(decodeURI(req.params.index))
//     console.log(params)
//     idlist = []
//     for (const [key, value] of params.entries()) {
//         console.log(`${key}, ${value}`);
//         idlist.push(parseInt(value))
//       }
//     console.log(idlist)
//     // idlist = `(${idlist.map(v => JSON.stringify(v)).join(', ')})`;
//     //  console.log(idlist)

//     try {
//         const { title } = req.params;
//         console.log(title)
//         const query = 'SELECT * FROM testbooks WHERE book_id = ANY($1::int[])';
//         const books = await pool.query(query, [idlist])
//         res.json(books.rows)
//         console.log(books.rows)
//     } catch (err) {
//         console.error(err)
//     }
// })

app.get('/books/:title', async (req, res) => {
    console.log("get:books/title")

    try {
        const { title } = req.params;
        console.log(title)
        const query = 'SELECT * FROM testbooks WHERE title ~* $1 limit 1';
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
        const query = 'SELECT * FROM testusers WHERE id = $1';
        const books = await pool.query(query, [id])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})


app.get('/stockuser/:id', async (req, res) => {
    console.log("getstockuser/id")

    try {
        const { id } = req.params;
        console.log(id)
        const query = 'SELECT * FROM testusers U JOIN teststock S on U.id=S.user_id where s.id = $1';
        const users = await pool.query(query, [id])
        res.json(users.rows)
        console.log(users.rows)
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
        book_id
    } = req.body
    try {
        const query = 'SELECT * FROM testbooks WHERE book_id = $1';
        const books = await pool.query(query, [book_id])
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
            UPDATE testbooks 
            SET 
            publishyear=$1,
            isbn=$2,
            genre=$3,
            img=$4,
            description=$5        
            WHERE book_id = $6
            `
            const values = [merge.publishyear, merge.isbn, merge.genre, merge.img, merge.description, book_id]
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


app.patch('/checkoutbook/', async (req, res) => {
    const {
        stockid, user_id
    } = req.body
    console.log("Checking Out:", stockid, 'User: ', user_id)

    var tmpdate = new Date();
    var duration = 7;
    tmpdate.setTime(tmpdate.getTime() + duration * 86400000);
    const due_date = tmpdate.toISOString().slice(0, 19).replace('T', ' ');


    console.log(due_date)
    try {
            const query = `
            UPDATE teststock 
            SET 
            instock=false, user_id = $1, due_date = $3
            WHERE id = $2
            `

            console.log(stockid)
            const booksupdated = await pool.query(query, [user_id , stockid, due_date])
            console.log(booksupdated.rows)


            res.status(200).json({
                books: stockid,
                message: 'Book Checked Out',

            });
         
    } catch (err) {
        res.status(500).json({
            books: stockid,
            message: 'Book Error:' + err,

        })
        console.error(err)
    }
})




















app.patch('/returnbook/', async (req, res) => {
    console.log(req.body)
    const {
        stockid, balance, user_id
    } = req.body
    console.log("Returning Book", stockid)
    

    try {
            const query1 = `
            UPDATE teststock 
            SET 
            instock=true, user_id = NULL, due_date = NULL
            WHERE id = $1;`

            const query2 =`
            UPDATE testusers
            SET
            balance = $1
            WHERE id = $2;
            `
            const values = [stockid]
            console.log(values)
            const booksupdated = await pool.query(query1, values)
            console.log(booksupdated.rows)

            const values2 = [ balance, user_id]
            console.log(values2)
            const usersupdated = await pool.query(query2, values2)
            console.log(booksupdated.rows)

            res.status(200).json({
                books: stockid,
                message: 'Book Returned',

            });
         
    } catch (err) {
        res.status(500).json({
            books: stockid,
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
        const existingUserQuery = 'SELECT * FROM testusers WHERE email = $1';
        const existingUserResult = await pool.query(existingUserQuery, [email]);

        if (existingUserResult.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);



        // Insert new user into the database
        const insertUserQuery = 'INSERT INTO testusers( firstName, lastName, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const insertedUserResult = await pool.query(insertUserQuery, [firstName, lastName, email, hashedPassword, role]);

        const newUser = insertedUserResult.rows[0];

        if (role === 'employee') {
            const insertEmployeeQuery = 'INSERT INTO employee(user_id, position) VALUES($1, $2)';
            await pool.query(insertEmployeeQuery, [newUser.id, 'worker']);
        }

        let loginData = {
            email: newUser.email,
            role: newUser.role,
            signInTime: Date.now(),
        };

        const token = jwt.sign(loginData, jwtSecretKey);
        res.status(200).json({
            message: "success",
            token,
            role: newUser.role
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
        const getUserQuery = 'SELECT * FROM testusers WHERE email = $1';
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
            role: user.role,
            loggedIn: true
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
        const getUserQuery = 'SELECT * FROM testusers WHERE email = $1';
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
