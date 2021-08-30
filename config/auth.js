var isAdmin = function(req, res, next) {
    res.redirect('/admin-login');
}

var isUser = function(req, res, next) {
    let check_user = req.session.is_user_logged_in;
    let check_user_id=req.session.re_us_id;
    if (check_user != undefined && check_user !="" && check_user==true && check_user_id!="") {
        next();
    } else {
        req.flash('danger', 'Please log in first.');
        res.redirect('/Login');
    }
}

module.exports = {
    isUser:isUser,
    isAdmin:isAdmin
}


