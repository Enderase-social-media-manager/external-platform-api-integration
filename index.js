// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const users = require('./src/users')

// const server = http.createServer((req, resp) => {
//   if (req.url === '/') {
//     fs.readFile(
//       path.join(__dirname, 'public', 'index.html'),
//       (err, content) => {
//         resp.writeHead(200, { 'Content-Type': 'text.html' });
//         resp.end(content);
//         console.log(resp.statusCode,resp.statusMessage)
//       }
//     );
//   }

//   if (req.url === '/users' && req.method == 'GET') {

//         resp.writeHead(200, { 'Content-Type': 'application/json' });
//         resp.end(JSON.stringify(users));

//   }
// });

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`Server started on port:${PORT}`);
// });

import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/user.js';
import contentRoutes from './routes/content.js';
import {logger} from './functions/logger.js'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(logger)


app.use('/user', usersRoutes);
app.use('/content', contentRoutes);
app.use('/' || '/:else', (req, res) => {
  // res.send(JSON.parse('{"error" : {"message":"page not found"}}'));
  res.json({"error" : {"message":"page not found"}});
});
//500 internal server error
app.use((err,req,res,text)=>{
  console.error(err.stack)
  res.type('application/json')
  res.status(500).send({error: "Internal server error"})
})


app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
