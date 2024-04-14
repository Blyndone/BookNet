-- User that have checked out the same books

select U1.id, R1.book_id, U2.id from 
testusers U1  join testreservations R1 on U1.id = R1.user_id 
Join testreservations R2 on R1.book_id = R2.book_id
Join testusers U2 on R2.user_id = U2.id

where U1.id =1 and U1.id <> U2.id


-- USER that has checked the most matching books 
select count(U1.id),  U2.id from 
testusers U1  join testreservations R1 on U1.id = R1.user_id 
Join testreservations R2 on R1.book_id = R2.book_id
Join testusers U2 on R2.user_id = U2.id

where U1.id =1 and U1.id <> U2.id
group by U2.id
order by count desc limit 1

--- MATCHING user info
with user2 (ucount, uid) as 
(select count(U1.id), U2.id FROM 
testusers U1  join testreservations R1 on U1.id = R1.user_id 
Join testreservations R2 on R1.book_id = R2.book_id
Join testusers U2 on R2.user_id = U2.id

where U1.id =1 and U1.id <> U2.id
group by U2.id
order by count desc limit 1) 

Select * from testusers join user2 on user2.uid = testusers.id

--- Books Checked out by user 2 but not 1
with user2 (ucount, u2id, u1id) as 
(select count(U1.id), U2.id, U1.id FROM 
testusers U1  join testreservations R1 on U1.id = R1.user_id 
Join testreservations R2 on R1.book_id = R2.book_id
Join testusers U2 on R2.user_id = U2.id
where U1.id =1 and U1.id <> U2.id
group by U2.id, U1.id
order by count desc limit 1) 

select book_id from testreservations r1 join user2 on r1.user_id = user2.u2id
Except
select book_id from testreservations r2 join user2 on r2.user_id = user2.u1id

----
---buddy Reccomendation 
WITH
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
			U1.ID = 1
			AND U1.ID <> U2.ID
		GROUP BY
			U2.ID,
			U1.ID
		ORDER BY
			COUNT DESC
		LIMIT
			1
	)
SELECT
	*
FROM
	TESTBOOKS
WHERE
	BOOK_ID IN (
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
ORDER BY
	CHECKOUT_COUNT DESC
LIMIT
	10

------------
--Your Top Genres, Popular books you have not read

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
			U.ID = 1
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
				U.ID = 1
		)
	)
SELECT
	*
FROM
	TESTBOOKS B1
	JOIN NOTREAD B2 ON B1.BOOK_ID = B2.BOOKS
ORDER BY
	CHECKOUT_COUNT desc
LIMIT
	10
offset 0