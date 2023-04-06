const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// Set the view engine to use Pug
app.set('view engine', 'pug');

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Homepage route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Create user ID route
app.post('/create-user', (req, res) => {
  const userId = req.body.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const user = {
    userId: userId,
    firstName: firstName,
    lastName: lastName
  };
  fs.readFile('mydata.txt', (err, data) => {
    let users = [];
    if (!err) {
      users = JSON.parse(data);
    }
    users.push(user);
    fs.writeFile('mydata.txt', JSON.stringify(users), err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`User ID ${userId} created`);
      res.redirect('/');
    });
  });
});

// Search for user ID route
app.post('/search-user', (req, res) => {
  const userId = req.body.userId;
  fs.readFile('mydata.txt', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let users = JSON.parse(data);
    let user = users.find(user => user.userId === userId);
    if (user) {
      res.render('user', { title: 'User', user: user });
    } else {
      res.render('user', { title: 'User', error: 'User ID not found' });
    }
  });
});

// Create mydata.txt file if it doesn't exist
if (!fs.existsSync('mydata.txt')) {
  fs.writeFileSync('mydata.txt', '[]');
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});