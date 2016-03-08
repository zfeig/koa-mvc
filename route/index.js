var bodyParse =require('koa-better-body');
var indexCtrl =require('../controllers/index');

module.exports=function(router){
          
        //定义index控制器的index方法
		router.get('/',indexCtrl.index);

		//定义index控制器的user方法
	 	router.get('/user',indexCtrl.user);

	 	//定义index控制器的detail方法
	 	router.get('/user/:id',indexCtrl.detail);

		//定义一个表单
		router.get('/form',indexCtrl.getForm);
		router.post('/form',indexCtrl.postForm);

	   //定义一个query
	   router.get('/query',indexCtrl.query);

		//文件下载
		router.get('/download',indexCtrl.download);

	  //定义一个上传表单
		router.get('/upload',indexCtrl.upform);

	  //处理上传结果
		router.post('/upload',bodyParse({multipart:true}),indexCtrl.doupload);

		//文件列表
		router.get('/files/:pt?',indexCtrl.filelist);

	   //中文分词
		router.get('/chinese',indexCtrl.fenci);

	  //处理中文分词
		router.post('/chinese',indexCtrl.dofenci);
	 	return router;
}





