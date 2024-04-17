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

       const querystring = `
    SELECT 
        count(S.instock) as stockcount, 
        B.*, 
        A.* 
    FROM 
        (testbooks B JOIN testauthors A ON B.author = A.id) 
        JOIN teststock S ON B.book_id = S.book_id   
    WHERE 
        B.title ~* $1 OR A.author_name ~* $1 OR B.genre ~* $1
    GROUP BY 
        B.book_id, 
        A.id 
    ORDER BY 
        B.book_id 
    LIMIT 
        $2 
    OFFSET 
        $3
`; const books = await pool.query(querystring, [query, limit, offset])
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
    if (userid === undefined || offset === undefined) {
        console.log('Missing parameters');
        return res.status(400).json({ message: 'Missing parameters' });
    }
console.log("user",userid)
    if (userid.length <= 0){
       
        return res.status(400).json({ message: 'Missing parameters' });
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
    console.log("user",userid)
    if (userid.length <= 0){
       
        return res.status(400).json({ message: 'Missing parameters' });
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

const querystring = `
SELECT *, 
       A.author_name
FROM   testbooks B
JOIN   teststock S 
ON     B.book_id = S.book_id
JOIN   testauthors A 
ON     B.author = A.id
WHERE  S.id = $1
`;
        const books = await pool.query(querystring, [query])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})

// ==========================

app.get('/books/stocksearch/', async (req, res) => {
    console.log("get:books/stocsearch")


    let { query } = req.query
    console.log("params", query)
    if (query.length <= 0){
        query = '.*'
    }



    try {

const querystring = `
SELECT
	B.book_id, B.title, A.author_name, B.genre, S.id, S.instock, s.book_condition,U.id, U.firstname, U.lastname, s.due_date
FROM
	TESTBOOKS B
	JOIN TESTAUTHORS A ON B.AUTHOR = A.ID
	JOIN TESTSTOCK S ON S.BOOK_ID = B.BOOK_ID
	Left JOIN TESTUSERS U ON s.USER_ID = U.ID
WHERE
	B.TITLE ~* $1 OR B.GENRE ~* $1 OR A.AUTHOR_NAME ~* $1
ORDER BY
    B.BOOK_ID, S.ID
`;
        const books = await pool.query(querystring, [query])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})
//============================
app.get('/book/index/', async (req, res) => {
    console.log("get:book/index");

    let { query } = req.query;
    console.log("Received query parameter: ", query);
    if (query.length <= 0){
        query = '.*';
    }

    try {
        const querystring = `
            SELECT *, 
                   A.author_name
            FROM   testbooks B
            JOIN   testauthors A 
            ON     B.author = A.id
            WHERE  B.book_ID = $1
        `;
        console.log("Executing query: ", querystring);
        const books = await pool.query(querystring, [query]);
        console.log("Received books: ", books.rows);
        res.json(books.rows);
    } catch (err) {
        console.error("Error occurred: ", err);
    }
});






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

       const querystring = `
    SELECT 
        count(S.instock) as stockcount, 
        B.*, 
        A.* 
    FROM 
        (testbooks B JOIN testauthors A ON B.author = A.id) 
        JOIN teststock S ON B.book_id = S.book_id   
    WHERE 
        S.id = $1  
    GROUP BY 
        B.book_id, 
        A.id 
    ORDER BY 
        B.book_id 
    LIMIT 
        $2 
    OFFSET 
        $3
`; const books = await pool.query(querystring, [query, limit, offset])
        res.json(books.rows)
        console.log(books.rows)
    } catch (err) {
        console.error(err)
    }
})


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


// Define a GET route handler for '/user/:id'
app.get('/user/:id', async (req, res) => {
    // Log a message indicating that this route handler has been entered
    console.log("get:user/id")

    try {
        // Extract the 'id' parameter from the request parameters
        const { id } = req.params;
        // Log the 'id' parameter
        console.log(id)

        // Define a SQL query that selects all columns from the 'testusers' table where the 'id' column matches a parameter
        const query = 'SELECT * FROM testusers WHERE id = $1';

        // Execute the SQL query, passing the 'id' parameter as the value to match
        // Use the 'await' keyword to wait for the query to complete before moving on to the next line of code
        const user = await pool.query(query, [id])

        // Send the rows returned by the query as a JSON response
        res.json(user.rows)

        // Log the rows returned by the query
        console.log(user.rows)
    } catch (err) {
        // If any errors occur during the execution of the try block, catch them and log them to the console
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
app.patch('/book', async (req, res) => {
    const { book_id, author_name } = req.body;
    try {
        const query = 'SELECT * FROM testbooks WHERE book_id = $1';
        const books = await pool.query(query, [book_id]);
        if (books.rows.length > 0) {
            for (const [key, value] of Object.entries(req.body)) {
                if (key == "book_id" || key == "author_id" || value.length == 0) {
                    // Do nothing
                } else {
                    books.rows[0][key] = value;
                }
            }
            const merge = books.rows[0];
            const query = `
                UPDATE testbooks 
                SET 
                title=$1,
                publishyear=$2,
                isbn=$3,
                genre=$4,
                img=$5,
                description=$6
                WHERE book_id = $7
            `;
            const values = [merge.title, merge.publishyear, merge.isbn, merge.genre, merge.img, merge.description, book_id];
            const booksupdated = await pool.query(query, values);

            // Update author name in testauthors table
            const authorQuery = `
                UPDATE testauthors
                SET author_name = $1
                WHERE id = $2
            `;
            const authorValues = [author_name, merge.author];
            await pool.query(authorQuery, authorValues);

            res.status(200).json({
                books: merge,
                message: 'Book and author updated',
            });
        } else {
            res.status(500).json({
                message: "Book Not Found",
            });
        }
    } catch (err) {
        console.error(`Error occurred: ${err}`);
    }
});


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
    console.log('POST /signup called');
    const {
        firstName,
        lastName,
        email,
        password,
        role
    } = req.body;
    console.log('Received data:', { firstName, lastName, email, role });

    try {
        // Check if user already exists
        const existingUserQuery = 'SELECT * FROM testusers WHERE email = $1';
        console.log('Executing query:', existingUserQuery);
        const existingUserResult = await pool.query(existingUserQuery, [email]);
        console.log('Query result:', existingUserResult.rows);

        if (existingUserResult.rows.length > 0) {
            console.log('User already exists');
            return res.status(400).json({
                message: "User already exists",
                userExists: true
            });
        }

        // Hash the password
        console.log('Hashing password');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const insertUserQuery = 'INSERT INTO testusers( firstName, lastName, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING *';
        console.log('Executing query:', insertUserQuery);
        const insertedUserResult = await pool.query(insertUserQuery, [firstName, lastName, email, hashedPassword, role]);
        console.log('Query result:', insertedUserResult.rows);

        const newUser = insertedUserResult.rows[0];

        let loginData = {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            signInTime: Date.now(),
        };
        console.log('Login data:', loginData);

        const token = jwt.sign(loginData, jwtSecretKey);
        console.log('Generated token:', token);
        res.status(200).json({
            message: "success",
            token,
            role: newUser.role,
            id: newUser.id,
            email: newUser.email,
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
    id: user.id,
    email: user.email,
    role: user.role,
    signInTime: Date.now(),
};
        const token = jwt.sign(loginData, jwtSecretKey);
        res.status(200).json({
            message: "success",
            token,
            role: user.role,
            id:user.id,
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
    console.log('POST /check-account called');
    try {
        const { email } = req.body;
        console.log('Received email:', email);

        // Check if user exists in the database
        const getUserQuery = 'SELECT * FROM testusers WHERE email = $1';
        console.log('Executing query:', getUserQuery);
        const result = await pool.query(getUserQuery, [email]);

        const user = result.rows;
        console.log('Query result:', user);

        res.status(200).json({
            status: user.length > 1 ? "User exists" : "User does not exist",
            userExists: user.length >= 1,
        });
    } catch (error) {
        console.error("Error checking account:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

app.post('/book', async (req,res) => {
    // console.log(req)
    const {title, author_name, isbn, publishyear, genre, img, description, count} = req.body;
    try {  
        
    const authorquery = 'INSERT INTO TESTAUTHORS  (AUTHOR_NAME)  SELECT $1   WHERE  NOT EXISTS (  SELECT *  FROM   TESTAUTHORS WHERE AUTHOR_NAME = $2) RETURNING id';
    const insertId = await pool.query(authorquery, [author_name, author_name]);
   let author_id = ''
    console.log("# of Inserted Author Rows:", insertId.rowCount)
    if (insertId.rowCount !=0 ){
        console.log('RowID:', insertId.rows[0].id)
        author_id =  insertId.rows[0].id
    }else{

       
        const aquery = 'SELECT id FROM testauthors where author_name = $1';

        const authorquery = await pool.query(aquery, [author_name]);
        author_id =  authorquery.rows[0].id
    }
    const bquery =`INSERT INTO testbooks (title, author,  publishyear, isbn, genre, img, checkout_count, description)
                 VALUES ($1, $2, $3, $4, $5, $6, 0, $7)  RETURNING book_id`
    const bookinsert = await pool.query(bquery, [title, author_id, publishyear, isbn, genre, img,description])
    
    console.log(bookinsert.rows)

    const stockquery = `INSERT INTO teststock (book_id, instock, book_condition)
    VALUES($1, 'true', 'Good') RETURNING id;`
    let bid = bookinsert.rows[0].book_id
    console.log(bid)
    let loopcount =parseInt(count)
    
    while(loopcount >0){
    const stockinsert = await pool.query(stockquery, [bid])
    console.log(stockinsert)
        loopcount= loopcount -1
    }
    
            // 200 Message
            return res.status(200).json({
                message: 'A new book has been added.'
            });
        

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
