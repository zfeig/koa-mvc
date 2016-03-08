
var articleCtrl =require('../controllers/article');

module.exports=function(router){
          
        //定义index控制器的index方法
		router.get('/a/list/:id?',articleCtrl.list);

		//定义index控制器的user方法
	 	router.get('/a/detail/:id',articleCtrl.detail);

	 	//定义index控制器的list方法
	 	router.get('/a/cate/list',articleCtrl.catelist);

	 	//定义index控制器的detail方法
	 	router.get('/a/cate/:id',articleCtrl.catedetail);

	 	return router;
}





