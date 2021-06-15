const express = require("express");
// const ejs = require("ejs");
const app = express();
// var cors = require('cors');
// app.use(cors());

// app.set("view engine", "ejs");
// app.use(express.urlencoded({extended: false}));
// app.use(express.json());
// app.use(express.static(__dirname + '/'));

const sqlite3 = require('sqlite3').verbose();
// const sqlite = require('sqlite');
// async function getDBConnection(){
//     const db = await sqlite.open({
//         filename: 'product.db',
//         driver: sqlite3.Database
//     });
//     return db;
// }

app.get("/album", function(req, res) {

    let searchTerm = req.query.term;
    let category = req.query.genre;
    console.log(req.query);
    console.log(category, searchTerm);
    let db = new sqlite3.Database('product.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
            console.error(dbPath);
    
        } else {
            console.log('Connected to the database.');
        }
    });
    let query = '';

    if (category === 'All') {
        if (searchTerm === '') {
            query = `SELECT * FROM albums`;
        } else {
            query = `SELECT * FROM albums WHERE product_title LIKE '%${searchTerm}%'`;
        }
    } else {
        if (searchTerm === '') {
            query = `SELECT * FROM albums WHERE product_category='${category}'`;
        } else {
            query = `SELECT * FROM albums WHERE product_category='${category}' AND product_title LIKE '%${searchTerm}%'`;
        }
    }

    // let rows = await db.all(query);
    // await db.close();
    // console.log(rows);
    // res.json(rows);
    db.all(query, [], (err, rows)=>{
        if(err) {
            throw err;
        }
        res.json(rows);
    })

    db.close((err) =>{
        if(err){
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });

});

// app.get("/", function(req, res){
//     res.render("index", {});
// });

// app.post("/album", async function(req, res) {
//     let db = await getDBConnection();
//     let searchTerm = req.body.searchTerm;
//     let category = req.body.category;
//     let query = '';

//     if (category === 'All') {
//         if (searchTerm === '') {
//             query = `SELECT * FROM albums`;
//         } else {
//             query = `SELECT * FROM albums WHERE product_title LIKE '%${searchTerm}%'`;
//         }
//     } else {
//         if (searchTerm === '') {
//             query = `SELECT * FROM albums WHERE product_category='${category}'`;
//         } else {
//             query = `SELECT * FROM albums WHERE product_category='${category}' AND product_title LIKE '%${searchTerm}%'`;
//         }
//     }

//     let rows = await db.all(query);
//     await db.close();
//     console.log(rows);
//     res.json(rows);
// });

// app.get("/product/:num", function(req, res) {
//     const idx = req.params.num;
//     let db = new sqlite3.Database('product.db', sqlite3.OPEN_READWRITE, (err)=>{
//         if(err) {
//             console.log(err.message);
//             console.log(dbPath);
//         } else {
//             console.log('Connected to db.');
//         }
//     });
//     res.render("album", {
//         num: idx
//     });
// });

// async function getDBConnection(){
//     const db = await sqlite.open({
//         filename: 'product.db',
//         driver: sqlite3.Database
//     });
//     return db;
// }

// app.get("/hello/:num", function(req, res) {
//     res.render("test2", {
//         // one : "this is one",
//         // two : "this is two"
//         num: req.params.num
//     });
// });

// app.post("/postTest", function(req, res) {
//     console.log(req.body);
//     res.json({ok:true, name: req.body.name});
// });

// app.get("/hello/:num", function(req, res) {
//     console.log(req.body);
//     res.json({ok: true, name: req.body.name});
// });

app.listen(3000, function() {
    console.log("실행중...");
});