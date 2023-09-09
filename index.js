import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';

const elysia = new Elysia();

const port = 3000;

// serve static assets
elysia.use(staticPlugin({ assets: './static', prefix: '/' }));

// redirect '/' to '/index.html'
elysia.get('/', ({ set }) => { set.redirect = '/index.html' });

// start http server
elysia.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});