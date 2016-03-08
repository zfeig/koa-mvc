var views = require('co-views');
var render = views(__dirname + '/../views', { ext: 'ejs' });
//mysql相关model
var mysql = require('../models/mysql/mysql');
//mongodb相关model
var User =require('../models/mongodb/user');
var user =new User();//必须用new实例化User对象才可以用他的prototype方法

//公共函数库
var F =require('../common/function');


module.exports=  {
	list: function*(){   
	   var page=parseInt(this.params.id)||1;
	   var pageSize=10;
	   var data=yield mysql.pagenation(page,pageSize,'lastcoment','uid not in(15,18,19)');
       this.body= yield render('article/list',{data:data});
	},

	detail : function*(){
	var id=this.params.id||0;
		var data =yield mysql.queryOne("select * from lastcoment where uid=?",[id]);
		if(!data.uid){
			yield F.err(this,'抱歉，没有找到合适记录！');
			return;
		}
		this.body= yield render('article/detail',{id:id,data:data});
	},

	catelist : function*(){
		try{
		var data =yield user.findAll();
		}catch(err){
			console.log(err.message);
			yield F.err(this);
			return;
		}
		this.body = yield render('article/catelist',{data:data});
	},

    catedetail : function*(){
	var id=this.params.id||0;
	try{
		var data = yield user.findById(id);
	}catch(err){
		console.log(err.message);
		yield F.err(this,'抱歉，没有找到合适记录！');
		return;
	}
    
    console.log(data);
	this.body = yield render('article/catedetail',{data:data});
	}


}









