var fs =require('fs');
var crypto = require('crypto');
function* err(context,msg){
	var msg=msg||'sorry! 404 not find';
	context.status =400;
	context.body=msg;
}

module.exports.err = err;

function getDir(dirname){
	return new Promise(function(resolve,reject){
			fs.readdir(dirname, function (err, files) {
				if(err){reject(err)};
				var filelist=[];
				if(Array.isArray(files) && files.length>0){
					files.forEach(function(file){
						console.log(file);
						filelist.push({name:file,path:dirname+'/'+file});
					})
				}
				resolve(filelist);
			})
		}).then(function (data) {
		console.log(data);
		return data;
	});
}
module.exports.getDir =getDir;


function getSize(path){
	return new Promise(function(resolve,reject){
		fs.stat(path,function(err,info){
			if(err){reject(err)}
				var isfile =info.isFile();//是否为目录
				var size =Math.round( info.size*10/1024)/10+'kb';//文件大小
			resolve({size:size,isfile:isfile});
		})
	}).then(function(data){
			console.log(data);
			return data;
		});
}
module.exports.getSize =getSize;



function isExist(path){
	return new Promise(function (resolve,reject) {
		fs.exists(path,function(status){
			if(status){
				resolve(status);//文件存在返回true
			}else{
				reject(status);//文件不存在，这里会抛出异常
			}

		});
	}).then(function(info){
			console.log(info);
			return info;
		},function(info){
			return false;
		});
}
module .exports.isExist =isExist;


function  readData(path){
	return new Promise(function(resolve,reject){
		fs.readFile(path,function(err,data){
			if(err){
				reject(err);//文件存在返回true
			}else{
				resolve(data);//文件不存在，这里会抛出异常
			}
		});
	}).then(function(data){
			console.log(data);
			return data;
		},function(err){
			console.log(err);
			return err;
		});
}
module .exports.readData =readData;

/**
 * 加密函数
 * @param text  需要加密的内容
 * @param key   秘钥
 * @returns {Query|*}  密文
 */
function encode(text,key){
	var secret = key || "asdhjwheru*asd123&123";
	var cipher = crypto.createCipher('aes-256-cbc',secret);
	var crypted =cipher.update(text,'utf8','hex');
	crypted+=cipher.final('hex');
	console.log(crypted);
	return crypted;
}
module.exports.encode = encode;

/**
 * 解密函数
 * @param text  需要解密的内容
 * @param key   秘钥
 * @returns {Query|*}
 */
function decode(text,key){
	var secret = key || "asdhjwheru*asd123&123";
	var decipher = crypto.createDecipher('aes-256-cbc',secret);
	var dec=decipher.update(text,'hex','utf8');
	dec+= decipher.final('utf8');//解密之后的值
	console.log(dec);
	return dec;
}
module.exports.decode = decode;

function getIp(self){
    var pos = self.host.lastIndexOf(':');
    var ip = self.host.substring(0,pos);
    console.log("ip address is:%s",ip);
    return ip;
}
module.exports.getIp = getIp;





