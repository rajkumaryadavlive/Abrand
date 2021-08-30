var middleware_check_login = (req,res,next)=>{

	var check_user = req.session.user_main_id;
	console.log(check_user);

	if(check_user == undefined){
		res.redirect('/admin-login');
	}
	next();
};

module.exports = {
	middleware_check_login:middleware_check_login
}