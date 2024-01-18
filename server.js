const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const PORT = 3000;
require('dotenv').config({path: '.env'})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());

let usersCollection;

MongoClient.connect(process.env.MONGO_URI)
    .then(client => {
     const db = client.db('practice');
     const usersCollection = db.collection('users');

    // leaving '' empty works - but if / no work
    // if I add /users no work
    // will remove all /users and leave blank
    app.get('', (req, res) => {
        usersCollection
            .find()
            .toArray()
            .then(results => {
                res.render('index.ejs', {usersCollection: results})
            })
            .catch(error => console.log(error))
    })

    app.post('/users',(req, res) => {
        usersCollection
            .insertOne(req.body)
            .then(result => {
                res.redirect('/');
            })
            .catch(error => console.log(error))
        console.log(req.body);
    })

    app.put('/users', (req, res) => {
        usersCollection
            .findOneAndUpdate(
                {username: req.body.username},
                {
                    $set: {
                        username: req.body.username,
                        password: req.body.password,
                    },
                },
                {
                    upsert: false,
                },
                {
                    returnNewDocument: true
                }
            )
            .then(result => {
                res.json('Sucess')
                return res
            })
            .catch(error => console.log(error))
    })

    app.delete('/users', (req, res) => {
        console.log('Request Body:', req.body);

        usersCollection
            .deleteOne(
                { username: req.body.username }
            )
            .then(result => {
                console.log(`Deleted ${req.body.username}`)
                console.log(result);
                res.json('Deleted user')
            })
            .catch(error => console.error(error))
    })
})
.catch(error => console.log(error))

// leaving this comment out makes the app works ??
// app.post('/users',(req, res) => {
//     console.log(req.body);
// })

app.listen(PORT, function() {
	console.log(`Server is live and update! Listening at port ${PORT}`);
})


