var koa =require('koa');
var app = koa();

var koa_router =require('koa-router');
var router = koa_router();
var serve = require('koa-static');

//启动redis
var config = require('./config/config.js');
var redis = require('redis');
var redisClient = redis.createClient(config.redis.port, config.redis.host, config.redis.options);
if(redisClient){
    console.log('redis is start ok!');
}

//配置session
var session = require('koa-generic-session');
var redisStore = require('koa-redis');
app.keys = ['keys', 'keykeys'];
app.use(session({
  store: redisStore()
}));

//配置flash对象
var flash = require('koa-flash');
app.use(flash());


//加载以控制器为主的集中路由
var indexRoute=require('./route/index')(router);
app.use(indexRoute.routes());

var articleRoute=require('./route/article')(router);
app.use(articleRoute.routes());



//设置静态资源
app.use(serve(__dirname + '/public'));


//自定义404错误页中间件,两种方式
app.use(function*(next){
	if(this.status){
		if(404==this.status){
		this.status=404;
		this.body ='sorry!some problems may happened,we will solve it as soon as  possible!';
		return;
		}
		yield next;
	}
});



//处理程序异常错误
app.on('error', function(err){
 		console.log('%s errors',err.message);
});


//服务器端口监听
app.listen(3000,function(){
	console.log('service listening  at 3000!');
});
