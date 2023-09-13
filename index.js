// Status Codes:
// 200 -> success
// 201 -> created successfully
// 401 -> invalid auth
// 403 -> forbidden
// 409 -> unique field already in use
// 422 -> incomplete or invalid information submitted
// 500 -> any server errors such as database problems

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const nunjucks = require('nunjucks');

nunjucks.configure({ autoescape: true });

import requestMethod from './middleware/requestMethod';
import { noauth } from './middleware/auth';
import v1 from './v1';

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestMethod);

nunjucks.configure('static', {
    autoescape: true,
    express: app
});

app.use('/api/v1', v1);

app.get('/', (req, res) => {
    res.render('index.html');
});
app.get('/register', noauth, (req, res) => {
    res.render('register.html');
});
app.get('/login', noauth, (req, res) => {
    res.render('login.html');
});

app.use(express.static('static'));

// start http server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});