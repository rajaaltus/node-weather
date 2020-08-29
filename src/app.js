const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const app = express();
const port = process.env.PORT || 3000;

//Paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

//Handlebar engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory 
app.use(express.static(publicDirectoryPath));

//routes
app.get('', (req, res)=> {
  res.render('index', {
    title: 'Home',
    name: 'Welcome'
  });
});

app.get('/about', (req, res)=> {
  res.render('about', {
    title: 'About',
    name: 'About Raja'
  });
});

app.get('/weather', (req, res)=> {
  if(!req.query.address) {
    return res.send({
      error: 'You must provide an address!'
    });
  }
  geocode(req.query.address, (error, { latitude, longtitude, location}={}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(latitude, longtitude, (error, forecastData)=> {
      if(error) {
        return res.send({ error });
      }
         res.send({ 
          forcast: forecastData,
          location,
          address: req.query.address
         });
    });
  });
  // res.render('weather', {
  //   title: 'Weather',
  //   name: 'Weather'
  // });
});



app.get('*', (req, res)=> {
  res.render('404', {
    title: '404',
    name: 'Page Not Found'
  });
});



app.get('/weather',(req, res) => {
  res.send('<h1>Weather Report</h1><br/><a href="/">Go back</a>');
});

//start server
app.listen(port, ()=> {
  console.log('Server is up on Port '+ port);
});