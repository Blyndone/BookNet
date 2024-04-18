-- Harry Potter

UPDATE stock
SET
	USER_ID = 1, due_date = '2024-04-22', instock = false
WHERE
	ID IN (
		716,
		153,
		343,
		7,
		74,
		278,
		77,
		66,
		39,
		81,
		3,
		1557,
		154
	);

-- LOTR
UPDATE stock
SET
	USER_ID = 2, due_date = '2024-04-21', instock = false
WHERE
	ID IN (
	55,
52,
60,
113,
82,
582,
533,
110,
495,
69,
33,
247
	);

--Calvin and Hobbes
    UPDATE stock
SET
	USER_ID = 3, due_date = '2024-04-23', instock = false
WHERE
	ID IN (
1,
4,
10,
13,
22,
23,
25,
29
	);

--sking
    UPDATE stock
SET
	USER_ID = 4, due_date = '2024-04-25', instock = false
WHERE
	ID IN (
308,
914,
754,
296,
755,
1491,
905,
51,
581,
258,
1241
	);



---gaiman

    UPDATE stock
SET
	USER_ID = 5, due_date = '2024-04-26', instock = false
WHERE
	ID IN (
24,
47,
56,
600,
661,
865,
1082,
1104
	);


