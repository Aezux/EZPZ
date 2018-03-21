// app/routes.js
const async = require("async");
const searchResults = require("../scripts/search.js");
const candidateResults = require("../scripts/candidateProfile.js");
const algorithm = require("../scripts/algorithm.js");

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', async function(req, res) {

		/* Gets the search results */
		let search = req.query.search;
		let results = [];
		if (search !== undefined)
			results = await searchResults.search(search);
		res.render('index.ejs', { posts: results });
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/inup', function (req, res) {
		res.render('inup.ejs');
	});

	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
    
    app.get('/employer_login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('employer_login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });
    
    app.post('/employer_login', passport.authenticate('local-employer-login', {
            successRedirect : '/employer_profile', // redirect to the secure profile section
            failureRedirect : '/employer_login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function (req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});
    
    app.get('/employer_signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('employer_signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));
    
    app.post('/employer_signup', passport.authenticate('local-employer-signup', {
		successRedirect : '/employer_profile', // redirect to the secure profile section
		failureRedirect : '/employer_signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)

	app.get('/profile', isLoggedIn, async function(req, res) {

		let results = await algorithm.searchCompanies("103");
		let userProfile = await candidateResults.getInfo("103"); // Switch this to the user ID  <<<+++++++++++++++++++ CHANGE THIS +++++++++++++++++++++++++++
		res.render('profile.ejs', {
			user : req.user, // get the user out of session and pass to template
			posts: results,
			info: userProfile
		});
        console.log(req.user + 'testing');
	});
    
    app.get('/employer_profile', isEmployerLoggedIn, function(req, res) {
		//req.user.role = 'Employer';
        res.render('employer_profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
        console.log(req.user);
	});

	// =====================================
	// SKILLS ==============================
	// =====================================
	app.get('/skills', function (req, res) {
		res.render('skills.ejs');
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
    
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

function isEmployerLoggedIn(req, res, next) {
    
    //req.user.role = 'Employer';
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}