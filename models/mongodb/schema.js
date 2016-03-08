var mongoose =require('mongoose');
var config = require('../../config/config');

module.exports.init= function(){
	mongoose.connect(config.mongod.uri,function(err,res){
		 if(err){console.log("ERROR connecting,check your mongodb config")}
  		 console.log("mongodb connect ok!");
	});	
};

module.exports.init();

var Schema =mongoose.Schema;
var userSchema = Schema({
    name:String,
    age:Number,
    sex:String,
    salary:Number
});

module.exports.User =mongoose.model('User',userSchema);