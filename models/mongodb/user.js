var schema =require('./schema');
var user =schema.User;

function User(){
	this.model=user;
}

User.prototype.init =function*(){
	schema.init();
}

User.prototype.findAll=function*(){
	
	var data=yield user.find({});
	return data;
}

User.prototype.findById=function*(id){
	var data =yield user.findOne({_id:id});
	return data;
}

module.exports=User;


// module.exports.findAll =function*(){
	
// 	var data=yield user.find({});
// 	return data;
// }