
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

const app = express();
const port = 5000;

// Read the data.json file content
const jsonData = fs.readFileSync('./data.json', 'utf-8');
const homepage = fs.readFileSync('./views/home.ejs');
const form = fs.readFileSync('./form.html', 'utf-8');

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// const userDataPath = "./data.json";
let userDatas = [];

try {
  if (jsonData) {
    userDatas = JSON.parse(jsonData);
  }
} catch (error) {
  console.error('Error reading or parsing JSON file:', error.message);
}

app.get("/", (req, res) => {
  // res.status(200).render("index", { userDatas });
  res.send(form)
});

app.listen(port, () => console.log(`Server running on PORT ${port}`));

// home route
app.get("/home", (req, res) => {
  res.render("home", { userData: userDatas });
});

app.get("/form", (req, res) => {
  res.send(form);
});
// app.get("/form", (req, res) => {
//   res.send(form)
// });

 
app.post('/submit', (req, res) => {
  try {
    const formData = req.body;
    userDatas.push(formData);
    formData.id = userDatas.length;
    // console.log(formData);
    

    fs.writeFileSync('./data.json', JSON.stringify(userDatas, null, 2), 'utf-8');
    // console.log(userDatas);

    // Render the home.ejs view with the updated userDatas

    res.redirect('/form');
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



     app.get('/edit/:id', (req, res) => {
  try {
    
    const userId = parseInt(req.params.id);

    
    if (isNaN(userId)) {
      return res.status(400).send('Invalid user ID');
    }

    
    const userToEdit =  userDatas.find(user => parseInt(user.id) === userId);

    
    if (!userToEdit) {
      return res.status(404).send(`User not found with the ID of ${userId}`);
    }
    // Render the 'edit' view with the userToEdit data
    res.render('edit', { userToEdit });
  } catch (error) {
    
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


   //update

   app.post('/update/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id)
  

    const originalId = parseInt(req.body.id);
    console.log(userId);

    // Ensure that userId is a valid integer
    if (isNaN(userId)) {
      return res.status(400).send('Invalid user ID');
    }

    if (userId !== originalId) {
      return res.status(400).send('Invalid request');
    }

    const formData = req.body;
        // console.log(formData);
    
    const userIndex = userDatas.findIndex(user => parseInt(user.id) === originalId);
    // console.log(userIndex);
  
    if (userIndex === -1) {
      return res.status(404).send('User not found');
    }
    

    // Update the user data
    userDatas[userIndex] = formData;

    
    fs.writeFileSync('./data.json', JSON.stringify(userDatas, null, 2), 'utf-8');

    console.log('Data successfully updated:');
// console.log(userDatas);
    
    res.redirect('/home');
  } catch (error) {
    console.log('Error message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/delete/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const index = userDatas.findIndex(user => parseInt(user.id) === userId);

    if (index !== -1) {
      
      userDatas.splice(index, 1);

      // Save the updated data to the file
      fs.writeFileSync('./data.json', JSON.stringify(userDatas, null, 2), 'utf-8');

      res.status(200).redirect('/home');
    } else {
      // If the user is not found, return a 404 response
      res.status(404).send(`User not found with the ID of ${userId}`);
    }
  } catch (error) {
    console.log('Error Message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




 
    


