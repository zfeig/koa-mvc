var views = require('co-views');
var render = views(__dirname + '/../views', { ext: 'ejs' });
var parse = require('co-body');
var fs =require('fs');
var os =require('os');
var path = require('path');
var F = require('../common/function');
var segment = require('segment');
var _ = require('underscore');
 _.str = require('underscore.string');
 _.v = require('validator');
//这种写法是ok的
module.exports=  {
	index: function*(req,res){     
             console.log(this.host);
             var pos = this.host.lastIndexOf(":");
             console.log(pos)
             console.log("ip is %s",this.host.substring(0,pos));
 		//cookie记录
		// var num= ~~this.cookies.get('num')+1;
        //this.cookies.set('num',num);
		//console.log(this.cookies.num);
       //console.log(this.cookies.get('tip'));
	   //session记录
	   var count =~~this.session.views+1;
	   this.session.views=count;
		//console.log(this.session);
		var self=this;
       this.body =yield render('index/index',{views:count,self:self});
	},

	user : function*(req,res){

		this.body= yield render('index/user',{user:{name:'lisi',age:25}});
	},

    detail : function*(){
	var id=this.params.id||0;
	this.body = yield render('index/detail',{id:id});
	},
	getForm : function*(){
		this.body =yield render('index/form',{ip:F.getIp(this)});
	},
	postForm : function*(){
		//这里用co-body处理表单，也可以用koa-better-body来处理
		var data =yield parse.form(this);
		console.log(data);
		this.body=data;
	},
	query : function*(){
		console.log(this.query);
		console.log(this.querystring);
		console.log(this.search);
		console.log(this.host);
		console.log(this.protocol);
		console.log(this.url);
		console.log(this.href);

		//方法一：通过this.query直接获取获取参数name
         var  name= this.query.name||'unkonw';


		//方法二：通过url模块parse方法解析url地址获取query部分的参数
		//var urlparse =require('url');
		//var name=urlparse.parse(this.href,true);
		//name=name.query.name;


		//方法三：通过querystring模块来解析参数
		//var querystring = require('querystring');
		//var obj =querystring.parse(this.querystring);
		//var str =querystring.stringify(this.query);
		//console.log(str);
		//console.log(obj);
        //var name =obj.name;


		//返回结果
		this.body="your name is: "+name;
	},
	download : function*(){
		var  p= this.query.p||'unkonw';
		p = F.decode(p);//解密参数，获取真实文件名信息
		//取文件名
		var start =p.lastIndexOf('/');
		var filename = p.substring(~~start+1);
		console.log(filename);

		//取真实文件路径
		var filepath= path.join(__dirname+'/../public/',p);
		console.log(filepath);
		this.set('Content-disposition','attachment;filename='+filename);
		//var output =fs.createReadStream(filepath);
		//console.log(output);
		//output.pipe(this.res);
		var info =yield F.readData(filepath);
		console.log(info);
		this.body=info;
	},
	upform : function* () {
		this.body =yield render('/index/upload',{ip:F.getIp(this)});
	},
	doupload : function*(){
        // console.log(this.request.body.files);
		//{
		//	fields:{
        //
		//		user :'',
		//		pwd	:'',
		//		sex	:'',
		//		from:'',
		//		hobby[]:'',
		//		files:{'upfile[]':[[object],[object]]}
		//	}
		//}

		var files=this.request.body.files.upfile;
		console.log(files);
		if(files.length>0){
			for(var item in files){
				var tmpath= files[item]['path'];
				var tmparr =files[item]['name'].split('.');
				var ext ='.'+tmparr[tmparr.length-1];
				var newpath =path.join('public/upload', parseInt(Math.random()*100) + Date.parse(new Date()).toString() + ext);
				console.log(tmpath);
				console.log(newpath);
				var stream = fs.createWriteStream(newpath);//创建一个可写流
				fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流
			}
		}else{
			//当files为对象时即只有一个文件被上传
			var tmpath= files['path'];
			var tmparr =files['name'].split('.');
			var ext ='.'+tmparr[tmparr.length-1];
			var newpath =path.join('public/upload', parseInt(Math.random()*100) + Date.parse(new Date()).toString() + ext);
			console.log(tmpath);
			console.log(newpath);
			var stream = fs.createWriteStream(newpath);//创建一个可写流
			fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流
		}

         //文件上传操作原理
		//var tmpath = path.join(os.tmpdir(), '1.txt');//模拟上传到临时目录的文件
		////console.log(tmpath);
		//var ext = ".txt";//上传后生成文件的后缀，一般和上传的文件后缀一致
		//var ph = path.join('public/upload', Date.parse(new Date()).toString() + ext);//生成新的上传文件路径全称
		////console.log(ph);
		//var stream = fs.createWriteStream(ph);//创建一个可写流
		//fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流

		//设置上传成功后页面提示
		this.request.acceptsCharsets("utf-8");
		this.cookies.set("tip",escape("文件上传成功！"),{maxAge:3000,expires:Date.now()+3000});
		//console.log(this.cookies.get("tip"));
		//上传成功后的页面跳转
		this.redirect('/');
	},
	filelist : function*(){
		var pt=this.params.pt||'';//通过参数获取相对路径
		var pathArr=[];
		if(pt.length>0){
			pathArr=pt.split('_');
		}
		var relativepath ='';
		if(pathArr.length>0){
           relativepath =pathArr.join('/');
			relativepath+='/';
		}
		console.log(relativepath);
		var dirname=path.join(__dirname,'../public/upload/'+relativepath);
		var status =yield  F.isExist(dirname);
		if(false===status){
			this.body= '目录或文件不存在！';
			return;
		}
		var data =yield F.getDir(dirname);
		if(data.length==0){
			this.body= '空目录，没有任何文件！';
			return;
		}else{
			for(var i in data){
				data[i]['url']='/upload/'+relativepath+data[i]['name'];

				var fileinfo =yield F.getSize(data[i]['path']);
				if(fileinfo.isfile){
					data[i]['size']=fileinfo.size;
					data[i]['encodeurl']=F.encode('/upload/'+relativepath+data[i]['name']);
				}else{
					var tmpArr=[];
					if(pt.length>0){
						tmpArr=pt.split('_');
					}
					tmpArr.push(data[i]['name']);
					console.log(tmpArr);
					data[i]['pt']='/files/'+tmpArr.join('_');
				}
			}
		}
		console.log(data);
		this.body=yield render('index/filelist',{data:data});
	},
	fenci : function*(){

		this.body = yield  render('/index/fenci',{ip:F.getIp(this)});
	},
	dofenci : function*(){
		var data =yield parse.form(this);
		var word =data.word;
        var fenci = new segment();
		fenci.useDefault();
		var rs =fenci.doSegment(word);
		console.log(rs);
        var res = _.filter(rs,function(obj){
				return  _.v.isIn(obj.p,[16,1048576]);//过滤条件，仅仅保留名词，动词和英文词汇，将过滤出结果作为推荐分类
																	//词性参考https://github.com/leizongmin/node-segment/blob/master/lib/POSTAG.js
		});

		//推荐去重
        var resData=[];
		for(var i in res){
			resData.push(res[i]['w']);
		}
		//字母大写转小写
		resData=_.map(resData,function(item){
			return item.toLowerCase();
		});
		resData =_.unique(resData);
		this.body=yield render('/index/dofenci',{word:word,rs:rs,res:resData}) ;
	}

}









