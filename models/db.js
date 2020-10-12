const mongoose = require('mongoose');
const URL = 'mongodb://localhost:27017/streamDB';

mongoose.connect(URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', function(){
    console.log('mongoose connected to '+ URL);
});
mongoose.connection.on('error', function(err){
    console.log('mongoose connection error'+ err);
});
mongoose.connection.on('disconnected', function(){
    console.log('mongoose disconnected ' );
});

