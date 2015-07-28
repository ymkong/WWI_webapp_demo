// for development
global.cburl = 'http://localhost:3000/callback';
global.pn = 3000;
// global.cburl = 'http://52.2.222.157:9000/callback';
// global.pn = 9000;

var express =      require('express'),
    http =         require('http'),
    config =       require('./config'),
    walker =       require('node-sync-walker'),
    dotenv =       require('dotenv');


var app = express();

dotenv.load();

app.set('showStackError', true);

// Prettify HTML
app.locals.pretty = true;


// Configure Logging
config.log(app);

// Configure templates
config.template(app);

// Configure parsers
config.parsers(app);

// Configure session
config.session(app);

// Configure passport
config.passport(app);

// Configure static folders
config.static(app);

walker.routeWalker(__dirname + '/routes', app);

var port = process.env.PORT || global.pn;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});
