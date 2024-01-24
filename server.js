// const PrismaClient = require('@prisma/client')
// const express = require('express');
// const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
// const app = express();
// const PORT = 3000;
// require('dotenv').config({path: '.env'})
// app.set('view engine', 'ejs')
// app.use(express.static('public'))
// app.use(bodyParser.urlencoded({ extended: true}))
// app.use(bodyParser.json());
// let usersCollection;
// const prisma = new PrismaClient();

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const prisma = new PrismaClient();


app.post('/users',(req, res) => {
    const {username, password} = req.body;
    prisma.user.create({
        data: {
            username,
            password,
            Post: {
                create: {
                    title: 'My First Post',
                    body: 'Lots of really cool stuff',
                },
            },
        }
    })
    .then(result => {
        res.redirect('/');
    })
    .catch(error => {
        // handle errors
        console.error(error);
        res.status(500).json({error: 'Internal Error'})
    })
})

MongoClient.connect(process.env.MONGO_URI)
    .then(client => {
     const db = client.db('practice');
     const usersCollection = db.collection('users');

    // leaving '' empty works - but if / no work
    // if I add /users no work
    // will remove all /users and leave blank
    app.get('/', async (req, res) => {
        const body = { users: null, posts: null }

        const users = await prisma.user
        .findMany()
            .then(results => {
                body.users = results;
        })
        .catch(error => console.error(error))

        const posts = await prisma.post
        .findMany()
            .then(results => {
                body.posts = results;
        })
        .catch(error => console.error(error));

        res.render('index.ejs', {body: body})
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


