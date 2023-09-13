const { serialize } = require('cookie');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

import prisma from '../../utils/db';

async function register(req, res) {
    try {
        const { email, name, password, confirmPassword } = req.body;
    
        if (!(email && name && password && confirmPassword))
            return res.status(422).send('All fields are required.');
        if (confirmPassword != password)
            return res.status(422).send('Passwords do not match.');
        if (name.length < 2 || name.length > 32)
            return res.status(422).send('Username must be between 2 and 32 characters.');
        if (password.length < 8 || password.length > 32)
            return res.status(422).send('Password must be between 8 and 32 characters.');
        if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
            return res.status(422).send('Invalid email address.');
        if (await prisma.user.findUnique({ where: { email: email } }))
            return res.status(409).send('Email address is already in use.');
    
        const salt = crypto.randomBytes(20).toString('hex');
        const hash = await Bun.password.hash(password + salt);
    
        // create user in db
        await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hash,
                salt: salt
            },
        });

        const token = jwt.sign({ email: email, name: name }, Bun.env.JWT_KEY, { expiresIn: '30d' });
        const cookie = serialize('token', token, {
            secure: Bun.env.NODE_ENV !== 'development',
            httpOnly: true,
            sameSite: 'strict',
            path: '/'
        });

        res.setHeader('Set-Cookie', cookie);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(req.originalUrl + ': ' + error.message);
        res.sendStatus(500);
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!(email && password))
            return res.status(422).send('All inputs are required.');

        let user = await prisma.user.findUnique({ 
            where: { 
                email: email 
            },
            select: {
                password: true,
                salt: true,
                name: true
            }
        });

        if (user) {
            const isValid = await Bun.password.verify(password + user.salt, user.password);

            if (!isValid) return res.status(401).send('Invalid password');

            const token = jwt.sign({ email: email, name: user.name }, Bun.env.JWT_KEY, { expiresIn: '30d' });
            const cookie = serialize('token', token, {
                secure: Bun.env.NODE_ENV !== 'development',
                httpOnly: true,
                sameSite: 'strict',
                path: '/'
            });
            
            res.setHeader('Set-Cookie', cookie);
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Invalid credentials.');
        }

    } catch (error) {
        console.log(req.originalUrl + ': ' + error.message);
        res.sendStatus(500);
    }
}

async function logout(req, res) {
    try {
        // remove the auth token from cookies
        res.clearCookie('token');
        res.sendStatus(200);
    } catch (error) {
        console.log(req.originalUrl + ': ' + error.message);
        res.sendStatus(500);
    }
}

export { register, login, logout };