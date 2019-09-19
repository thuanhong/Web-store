exports.get404 = (req, res, next) => {
	res.render('error/error', {
		path: "",
		title_page: 'Not Found'
	})
};