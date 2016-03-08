var config =require('../../config/config');
var co =require('co');
var wraper =require('co-mysql');
var mysql =require('mysql');

var dbpool =mysql.createPool({
	host : config['mysql']['dbhost'],
	port : config['mysql']['port'],
	user : config['mysql']['user'],
	password : config['mysql']['password'],
	database : config['mysql']['database']
});

var db=wraper(dbpool);

module.exports.query =function* (sql,values){
	
	return yield db.query(sql, values);
};


module.exports.queryOne =function* (sql,values){
	
	var rows= yield db.query(sql,values);
    return rows.length?rows[0]:[];

}

/**简单的表分页,pagenation(2,10,"threads","id>15 and status=1")
*@param  page 页码	
*@param  pageSize 每页显示条目数
*@param	 threads 表名
*@param	 field whrere满足的条件
**/
module.exports.pagenation=function* (page,pageSize,tableName,field){
	   var page =page||1;
	   var pageSize=pageSize||10;
	   var where="where 1=1";
	   if(field){
	   	   where+=" and "+field;
	   }
	   var sqlone = "select count(*) as num from "+tableName+" "+where;
	   
	   	console.log(sqlone);
	   	
	   var total=yield module.exports.queryOne(sqlone);
	   //console.log(total);
	   var totalPage =Math.ceil(total['num']/pageSize);
	   //console.log(totalPage);
	   if(page>totalPage){page=totalPage}
	   if(page<1){page=1}

	   var start =(page-1)*pageSize;

		var sqltwo ="select * from "+tableName+" "+where+" limit "+start+","+pageSize;
	    console.log(sqltwo);

	    var data=yield module.exports.query(sqltwo);

	   return {page:page,pageSize:pageSize,totalPage:totalPage,data:data};
}	




