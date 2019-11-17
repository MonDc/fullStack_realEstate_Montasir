const express = require('express');
const emailVerify = require('../controllers/emailVerfiy')
const authControllers = require('../controllers/authControllers');
const multer = require('multer');
var dateFormat = require('dateformat');
const pageRoutes = express.Router();





pageRoutes.route('/').get((req, res) => {
    authControllers.getPublishedAdvsTOP9().then(data => {
        res.render('index', {
            active: 'home',
            advs: data,
            existedUser: req.session.user,
            message: '',
            error: false
        })
    }).catch(error => {
        res.send(error);
    })
})



pageRoutes.route('/search').post((req, res) => {

    let tags = req.body.tags;
    let forsell = req.body.forSell;
    let country = req.body.country;
    let city = req.body.city;
    let district = req.body.district;
    let postalCode = req.body.postalCode;
    let keyWord = req.body.keyWord;
    let minPrice = req.body.minPrice;
    let maxPrice = req.body.maxPrice;
    authControllers.search(tags, forsell, country, city, district, postalCode, keyWord, minPrice, maxPrice).then(data => {
        res.json(data);
    }).catch(error => {
        res.json(2);
    })
})



// pageRoutes.route('/agents').get((req, res) => {
//     authControllers.showAgents().then((ok, error) => {
//         if (error) {
//             // res.send(error)
//             res.render('agents', {
//                 active: 'agents',
//                 existedUser: req.session.user,
//                 agents: ok,
//                 message: 'There is an Error',
//                 error: true
//             });
//         } else {
//             res.render('agents', {
//                 active: 'agents',
//                 existedUser: req.session.user,
//                 agents: ok,
//                 message: '',
//                 error: false
//             });
//         }
//     }).catch(err => {
//         res.send(err)
//     })
// });



pageRoutes.route('/agents').get((req, res) => {
    authControllers.showAgents().then(ok => {
        if (ok) {
                res.render('agents', {
                active: 'agents',
                existedUser: req.session.user,
                agents: ok,
                message: '',
                error: false
            });
        } else {
            // res.send(error)
            res.render('agents', {
                active: 'agents',
                existedUser: req.session.user,
                agents: ok,
                message: 'There is an Error',
                error: true
            });
        }

    }).catch(err => {
        res.send(err)
    })
});





pageRoutes.route('/property').get((req, res) => {
    authControllers.getPublishedAdvs().then(data => {
        res.render('property', {
            active: 'property',
            advs: data,
            existedUser: req.session.user,
            message: '',
            error: false
        });
    }).catch(error => {
        res.send(error);
    })

});



// pageRoutes.route('/property').post((req, res) => {


// })





pageRoutes.route('/about').get((req, res) => {
    res.render('about', {
        active: 'about',
        existedUser: req.session.user,
        message: '',
        error: false
    });
});


pageRoutes.route('/singleProperty').get((req, res) => {
    if (req.query.advId) {


        authControllers.AgentSinglePage(req.query.advId).then(data => {
            if (data) {
                console.log("===data======>")
                console.log(data)
                authControllers.getAdvCount(data[0][0].agent_ID).then(dData => {
                    if (dData) {
                        
                        data[0][0].agentAdvCount = dData[0].agentAdvCount;
                        res.render('singleProperty', {
                            active: 'singleProperty',
                            existedUser: req.session.user,
                            message: '',
                            error: false,
                            data: data[0][0],
                            imgs:data[1],
                            details:data[2]

                        });
                    } else {
                        data[0][0].agentAdvCount = 0;
                        res.render('singleProperty', {
                            active: 'singleProperty',
                            existedUser: req.session.user,
                            message: '',
                            error: false,
                            data: data[0][0],
                            imgs:data[1]
                        });
                    }
                }).catch(err => {
                    res.send(err);
                });
            } else {
                res.send('error')

            }
        }).catch(error => {
            res.send(error);
        })
    } else {
        res.redirect("/")
    }
});



pageRoutes.route('/contact').get((req, res) => {
    res.render('contact', {
        active: 'contact',
        existedUser: req.session.user,
        message: '',
        error: false
    });
});

pageRoutes.route('/contact').post((req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.subject || !req.body.message) {
        res.render('contact', {
            active: 'contact',
            existedUser: req.session.user,
            message: 'Please fill all fields',
            error: true
        });
    } else {
        emailVerify.contactSendEmail(req.body.email, req.body.subject, req.body.message, req.body.firstName, req.body.lastName, (ok, response) => {
            if (ok) {
                // res.send('Your Email has been sent. <br> We recieved your message and we will respond soon!')
                res.render('contact', {
                    active: 'contact',
                    existedUser: req.session.user,
                    message: 'Your Email has been sent. We recieved your message and we will respond soon!',
                    error: false
                });

            } else {
                // res.send(response)
                res.render('contact', {
                    active: 'contact',
                    existedUser: req.session.user,
                    message: 'There is an error occurred during the sending ',
                    error: true
                });
            }
        })

    }
});


pageRoutes.route('/register').get((req, res) => {
    if (req.session.user) {
        res.redirect('/admin');
    } else {
        res.render('register', {
            active: 'login',
            existedUser: false,
            emailExist: false,
            message: '',
            error: false

        });
    }
});



// verify
pageRoutes.route('/verify').get(function (req, res) {
    let verifyNumber = req.param("id");
    emailVerify.verfyEmail(verifyNumber).then(user => {
        if (user) {
            res.render('login', {
                active: 'login',
                existedUser: false,
                wrongUser: false,
                message: 'Thanks for verify. Now you can login',
                error: false

            })
            //res.send("Hello thanks for verify ")
        } else {
            res.render('login', {
                active: 'login',
                existedUser: false,
                wrongUser: false,
                message: 'This link is not valid',
                error: true

            })
            //res.send("this link is not valid ");

        }
    });
});

// end verify




// multer config
const storage = multer.diskStorage({
    destination: './public/profiles/',
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({
    storage: storage
});
pageRoutes.use('/register', upload.single('file'));

//end multer config




pageRoutes.route('/register').post((req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.dateOfBirth || !req.body.address || !req.file || !req.body.email || !req.body.mobile || !req.body.password) {
        res.render('register', {
            active: 'login',
            existedUser: false,
            emailExist: false,
            message: 'You must fill all this fields',
            error: true

        });
    } else {
        authControllers.checkEmail(req.body.email).then(data => {
            if (data.length) {
                res.render('register', {
                    existedUser: false,
                    active: 'login',
                    emailExist: true,
                    message: '',
                    error: false
                })
            } else {
                //             let bDate = new Date(req.body.dateOfBirth)
                //             var day = bDate.getDate();
                // var monthIndex = bDate.getMonth();
                // var year = bDate.getFullYear();
                let bDate = new Date(req.body.dateOfBirth).toISOString().replace(/[A-Z]/g, ' ')
                //res.send(req.body.dateOfBirth)
                //res.send(new Date(req.body.dateOfBirth).toISOString())
                //res.send(Date.parse());
                authControllers.addUser(req.body.firstName, req.body.lastName, bDate, req.body.password, req.body.email, req.body.mobile, req.body.address, req.file, req.headers.host).then(check => {
                    //authControllers.addUser(req.body.firstName, req.body.lastName,  year + '-' + monthIndex + '-' + day, req.body.password, req.body.email, req.body.mobile, req.body.address, req.body.file, req.headers.host).then(check => {
                    if (check) {
                        res.render('register', {
                            existedUser: false,
                            active: 'login',
                            emailExist: false,
                            message: 'Please verify your Account ',
                            error: false
                        })
                        //res.send('Please verify your Account then go to login page')
                        //     console.log(check);
                        //     // was: req.session.username = req.body.emailname
                        //     res.send("Please verify your Account then go to login page" + "<br><br><br>" + req.session.user._id);
                    } else {
                        res.render('register', {
                            existedUser: false,
                            active: 'login',
                            emailExist: false,
                            message: 'Sorry There is an  Error',
                            error: true
                        })
                        //res.send('Sorry there is error')
                        //     // res.send(false);
                        //     res.send("Sorry your Username or Email or Phone Number is Exist " + "<br>" + "Please Try another one");
                    }
                }).catch(error => {
                    res.send(error.message);
                });
            }
        }).catch(error => {
            res.send(error.message);
        });

    }

});





pageRoutes.route('/login').get((req, res) => {
    if (req.session.user) {

        res.redirect('/admin', {
            user: req.session.user
        });
    } else {
        res.render('login', {
            active: 'login',
            existedUser: false,
            wrongUser: false,
            message: '',
            error: false
        })
    }

});


pageRoutes.route('/login').post((req, res) => {
    if (!req.body.userNameloginname || !req.body.passwordloginname) {
        res.render('login', {
            active: 'login',
            existedUser: false,
            wrongUser: false,
            message: 'You must Enter your Email & Password',
            error: true
        })
    } else {
        authControllers.checkUserforlogin(req.body.userNameloginname, req.body.passwordloginname).then(user => {
            if (user && user.active && user.verify) {
                let dateOfBirth = Date.parse(user.dateOfBirth);
                user.dateOfBirth = dateFormat(dateOfBirth, "yyyy-mm-dd");;
                req.session.user = user;
                res.redirect('/admin');

            } else {
                // res.send('not user')
                res.render('login', {
                    active: 'login',
                    wrongUser: true,
                    existedUser: false,
                    message: '',
                    error: false
                })
            }

        }).catch(error => {
            res.send(error);
        });
    }
});






// pageRoutes.route('/details').get((req, res) => {
//     res.render('details', {
//         active: 'contact',
//         existedUser: req.session.user
//     });
// })



// pageRoutes.route('/details').post((req, res) => {

//     authControllers.insertDetails()
// })


module.exports = pageRoutes;