var config={
	"mysql":{
		"dbhost":"127.0.0.1",
		"port":3306,
		"user":"root",
		"password":"root",
		"database":"demo"
	},
	"mongod":{
		 "uri": 'mongodb://127.0.0.1:27017/zfeig',
	},
	"redis":{
		"port":6379,
		"host":"127.0.0.1",
		"options":{
			auth_pass: ''
		}
	},
	"author":"zfeig",
	"version":"1.0.0"
}

module.exports=config;