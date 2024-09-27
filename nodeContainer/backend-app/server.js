//server.js
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs  = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended:false}));
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(express.json());
//setting view engine to ejs
app.set("view engine", "ejs");
var ejs = require("ejs");
app.use(express.static('public'));

// handling CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", 
               "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// route for handling requests from the Angular client
app.get('/', (req, res) => {
    res.json({ message: 
            'My Server' });
});

app.post('/confirmEmail', urlEncodedParser, async (req, res) => {
  console.log(req.body)
  const email = req.body.email;

  if (email) {
      const data = await ejs.renderFile("/workspaces/ethan/Desktop/Ethan/ShipIt/nodeContainer/backend-app/views/confirmEmailTemplate.ejs", { email });
      
      const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: "xboxonebro14@gmail.com",
            pass: "fctk ocld ogsl fbti",
          },
        });
        
        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
          // send mail with defined transport object
          const info = await transporter.sendMail({
            from: '"Ship It!" <shipit.email>', // sender address
            to: email, // list of receivers
            subject: "Confirm Your Email!", // Subject line
            html: data
            // res.render('/workspaces/ethan/Desktop/Ethan/ShipIt/nodeContainer/backend-app/views/confirmEmailTemplate.ejs', {
            //   email
            // })
            // await readFile('emailTemplates/confirmEmailTemplate.html', 'utf8') // html body
          });
          console.log("Message sent: %s", info.messageId);
        }

        main().catch(console.error);
        // res.json({test:"test"});
      
  } else {
    res.json({ message: "There was an Error!"})
  }
});

app.post('/resetEmail', urlEncodedParser, async (req, res) => {
    console.log(req.body)
    const email = req.body.email;

    if (req.body.email) {
        const data = await ejs.renderFile("/workspaces/ethan/Desktop/Ethan/ShipIt/nodeContainer/backend-app/views/resetEmail.ejs", { email });

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: "xboxonebro14@gmail.com",
              pass: "fctk ocld ogsl fbti",
            },
          });
          
          // async..await is not allowed in global scope, must use a wrapper
          async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: '"Ship It!" <shipit.email>', // sender address
              to: req.body.email, // list of receivers
              subject: "Reset Your Password!", // Subject line
              text: "Test", // plain text body
              html: data
              // await readFile('emailTemplates/resetEmail.html', 'utf8') // html body
            });
            console.log("Message sent: %s", info.messageId);
          }
          
          main().catch(console.error);
          // res.sendStatus(200);
        
    } else {
      res.json({ message: "There was an Error!"})
    }
});

app.get('/confirmed', (req, res) => {
  res.sendFile( __dirname + '/emailTemplates/confirmedEmailMessage.html');
});

app.get('/resetMyPassword', (req, res) => {
  const email = req.query.email;
  console.log(req.query.email)
  res.render('resetMyPassword', {
    email
  })
});

require("./app/routes/users.routes.js")(app);

const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});