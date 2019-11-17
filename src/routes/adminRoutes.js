const express = require('express');
const multer = require('multer');
const dateFormat= require('dateformat');
const fs= require('fs');
const path= require('path');

const authControllers = require('../controllers/authControllers');

const adminRoutes = express.Router();


const {
    check,
    validationResult
} = require('express-validator');


// Anfang sessioning
adminRoutes.use((req, res, next) => {
    if (req.session.user) {
        next();

    } else {
        res.redirect('/login')
    }
});
// Ende sessioning

adminRoutes.route('/logout').get((req, res) => {

    res.redirect('/')
    req.session.destroy(); // to destroy the session
})




adminRoutes.route('/').get((req, res) => {
    console.log("sesioning")
    console.log(req.session.user)
    res.render('admin', {
        active: 'existedUser',
        existedUser: req.session.user,
        message:'',
        error:false
    });
});



adminRoutes.route('/addAdvertisement').get((req, res) => {
    res.render('addAdvertisement', {
        active: 'addAdvertisement',
        existedUser: req.session.user,
        message:'',
        error:false
    });
});





// multer config
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });
adminRoutes.use('/Addvertisement', upload.array('file', 10));

//end multer config





adminRoutes.post('/Addvertisement', [
    check('forSell').not().isEmpty(),
    check('country').not().isEmpty()

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() })
        //res.send('error');
        res.render('addAdvertisement', {
            active: 'addAdvertisement',
            existedUser: req.session.user,
            message:'Please Fill All Required Fields',
            error:true
        });
    }
    // let bDate = new Date(req.body.date);
    let bDate = new Date(Date.now())
    var day = bDate.getDate();
    var monthIndex = bDate.getMonth();
    var year = bDate.getFullYear();
    var houres = bDate.getHours();
    var minuts = bDate.getMinutes();
    var seconds = bDate.getSeconds();

    authControllers.addAddvertisement(req.body.forSell, req.body.country, req.body.city, req.body.district, req.body.title, req.body.postalCode, req.body.address1, req.body.address2, req.body.houseNumber, req.body.description, req.body.price , year + '-' + monthIndex + '-' + day+' '+houres+":"+minuts+":"+seconds, req.session.user.id).then(check => {
        if (check) {
            authControllers.addadvertisementImages(req.files, check.insertId).then(data => {

                let promises = [];

                if (req.body.tags) {
                    promises.push( authControllers.insertDetails('tags', req.body.tags, check.insertId));
                } 
                
                if(req.body.props){
                    let props = JSON.parse(req.body.props);
                    if(props.propName !== ""){
                        props.forEach(prop => {
                            promises.push(authControllers.insertDetails(prop.propName,prop.propValue,check.insertId));
                        });
                    }
                    
                }

                Promise.all(promises).then(datas=>{
                   // res.send('your advertisement added successfully');
                   res.render('addAdvertisement', {
                    active: 'addAdvertisement',
                    existedUser: req.session.user,
                    message:'Your advertisement added successfully',
                    error:false
                });
                }).catch(errors=>{
                   // res.send(errors);
                   res.render('addAdvertisement', {
                    active: 'addAdvertisement',
                    existedUser: req.session.user,
                    message:'Please check the details and checkbox  ',
                    error:true
                });
                })
            }).catch(error => {
                //res.send('error');
                res.render('addAdvertisement', {
                    active: 'addAdvertisement',
                    existedUser: req.session.user,
                    message:'Please Fill Required Fields And Add Some Pictures',
                    error:true
                });
            })

            // let userId = check.insertedId;
            console.log(check);
            //     // was: req.session.username = req.body.emailname
            //     res.send("Please verify your Account then go to login page" + "<br><br><br>" + req.session.user._id);

        } else {
            //res.send('sorry')
            res.render('addAdvertisement', {
                active: 'addAdvertisement',
                existedUser: req.session.user,
                message:'Sorry your advertisement did not added',
                error:true
            });
        }
    }).catch(error => {
        res.send(error.message);
    });
});




adminRoutes.route('/changePassword').get((req, res) => {
    res.render('changePassword', {
        active: 'changePassword',
        existedUser: req.session.user,
        message:'',
        error:false
    });
});



adminRoutes.route('/changePassword').post((req, res) => {
    if (!req.body.newPassword || !req.body.RenewPassword || !req.body.oldPassword) {
        res.render('changePassword', {
            active: 'changePassword',
            existedUser: req.session.user,
            message:'Please Fill The Three Fields',
            error:true
        });
    } else {

        authControllers.checkOldPassword(req.body.oldPassword, req.session.user.id).then(data => {
            if (req.body.oldPassword === req.session.user.password) {
                if (req.body.newPassword === req.body.RenewPassword) {
                    authControllers.changePassword(req.body.newPassword, req.session.user.id).then(data => {
                        if (data) {
                            res.redirect('/login')
                            req.session.destroy();

                        } else {
                            //res.send('sorry')
                            res.render('changePassword', {
                                active: 'changePassword',
                                existedUser: req.session.user,
                                message:'There is an Error',
                                error:true
                            });
                            
                        }
                    }).catch(error => {
                        res.send(error.message);
                    });
                } else {
                    //res.send('password not match with re-password');
                    res.render('changePassword', {
                        active: 'changePassword',
                        existedUser: req.session.user,
                        message:'Password not match with Re-Password',
                        error:true
                    });
                }

            } else {
                //res.send("Old password not correct")
                res.render('changePassword', {
                    active: 'changePassword',
                    existedUser: req.session.user,
                    message:'The Old Password not Correct',
                    error:true
                });
            }
        }).catch(error => {
            res.send(error.message);
        });


    }
});



adminRoutes.route('/changePersonalInfo').get((req, res) => {
    res.render('changePersonalInfo', {
        active: 'changePersonalInfo',
        existedUser: req.session.user,
        message:'',
        error:false
    });

})



// multer config
const profilestorage = multer.diskStorage({
    destination: './public/profiles/',
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});
const profileUpload = multer({ storage: profilestorage });
adminRoutes.use('/changePersonalInfo', profileUpload.single('file'));


adminRoutes.route('/changePersonalInfo').post((req, res) => {
    console.log(req.body)
    console.log(req.session.user.id)
  // I think there is a problem here (if !req.body.firstName)
      if (!req.body.firstName || !req.body.lastName || !req.body.dateOfBirth || !req.body.address   || !req.body.mobile || !req.body.password) {
        res.render('changePersonalInfo', {
            active: 'changePersonalInfo',
            existedUser: req.session.user,
            message:'Please Fill All Fields',
            error:true
        });
     } else {
    authControllers.changePersonalInfo(req.body.firstName, req.body.lastName, dateFormat( Date.parse(req.body.dateOfBirth),'yyyy-mm-dd'),req.body.password, req.body.mobile,req.body.address,(req.file?"/profiles/"+req.file.filename:null), req.session.user.id).then(check => {
        if (check) {
            if(req.file && req.session.user.imgUrl){
                let url = path.join(__dirname,"/public"+req.session.user.imgUrl)
                fs.unlink(url.replace('/src/routes','').replace('\\src\\routes',''), (err)=>{
                
                    if(err){
                        // res.send('update error')
                        res.render('changePersonalInfo', {
                            active: 'changePersonalInfo',
                            existedUser: req.session.user,
                            message:'Update Error',
                            error:true
                    
                        });
                    }else{
                        // here when image changed and delete the old one
                        req.session.user.imgUrl = req.file.filename;
                        req.session.user.firstName = req.body.firstName;
                        req.session.user.lastName = req.body.lastName;
                        req.session.user.mobile = req.body.mobile;
                        req.session.user.address = req.body.address;
                        req.session.user.password = req.body.password;
                        req.session.user.dateOfBirth = dateFormat( Date.parse(req.body.dateOfBirth),'yyyy-mm-dd');

                        // res.send('update success')
                        res.render('changePersonalInfo', {
                            active: 'changePersonalInfo',
                            existedUser: req.session.user,
                            message:'Update Success',
                            error:false
                    
                        });
                    }
                    // path:"/home/basel/Desktop/28.10.2019/src/routes/public/profiles/1572352332410-img_1.jpg"

                });
            }else{
                // here with out change the image 
                        req.session.user.firstName = req.body.firstName;
                        req.session.user.lastName = req.body.lastName;
                        req.session.user.mobile = req.body.mobile;
                        req.session.user.address = req.body.address;
                        req.session.user.password = req.body.password;
                        req.session.user.dateOfBirth = dateFormat( Date.parse(req.body.dateOfBirth),'yyyy-mm-dd');

                    //  res.send('update ssssssuccess')
                        res.render('changePersonalInfo', {
                        active: 'changePersonalInfo',
                        existedUser: req.session.user,
                        message:'Update Ssssssuccess', // I think there is a problem here
                        error:false
        
                });
            }
            
                }else{
                    res.render('changePersonalInfo', {
                        active: 'changePersonalInfo',
                        existedUser: req.session.user,
                        message:'Update Error',
                        error:true
                
                    });
        }
    

    }).catch(error => {
        res.send(error.message);
    });
    }
});


adminRoutes.route('/userManag').get((req, res) => {
    
    if (req.session.user.userType=='Admin') {
        const id = req.session.user.id
        authControllers.getUsers().then((ok, error) => {
            if (error) {
                res.send(error)
            } else {
                res.render('userManag', {
                    active: 'userManag',
                    message:'',
                    error:false,
                    existedUser: req.session.user,
                    data: ok.map(element=> {
                        element.dateOfBirth = dateFormat(element.dateOfBirth,'dd-mm-yyyy');
                        return element
                    })
                });
            }

        }).catch(error => {
            res.send(error)
        })


    } else {
        res.redirect('/')
    }

})


adminRoutes.post("/userinfo", (req, res) => {
    if(req.session.user.userType=='Admin'){
        if (!req.body.firstName || !req.body.lastName || !req.body.dateOfBirth || !req.body.address   || !req.body.mobile || !req.body.password) {
            res.redirect("/admin/userinfo");
        } else {
        authControllers.updateUserInfo(req.body.firstName,req.body.lastName, dateFormat( Date.parse(req.body.dateOfBirth),'yyyy-mm-dd'),req.body.password,req.body.mobile,req.body.address, req.body.ID).then(check => {
            if (check) {
                //res.send('done')
                res.render('userManag', {
                    active: 'userManag',
                    message:'Update Success',
                    error:false,
                    existedUser: req.session.user,
                    data: ok.map(element=> {
                        element.dateOfBirth = dateFormat(element.dateOfBirth,'dd-mm-yyyy');
                        return element
                    })
                });
            } else {
                //res.send('error')
                res.render('userManag', {
                    active: 'userManag',
                    message:'Update Error',
                    error:true,
                    existedUser: req.session.user,
                    data: ok.map(element=> {
                        element.dateOfBirth = dateFormat(element.dateOfBirth,'dd-mm-yyyy');
                        return element
                    })
                });
                
            }
        }).catch(error => {
            res.send(error)
        });
    }
    }else
    {
        res.redirect('/');
    }
    

});


adminRoutes.post("/del", (req, res) => {
    if(req.session.user.userType=='Admin'){
    authControllers.deleteUserInfo(req.body.ID).then((ok, error) => {
        if (error) {
            //res.send('error')
            res.render('userManag', {
                active: 'userManag',
                message:'Delete Error',
                error:true,
                existedUser: req.session.user,
                data: ok.map(element=> {
                    element.dateOfBirth = dateFormat(element.dateOfBirth,'dd-mm-yyyy');
                    return element
                })
            });
        } else {
            //res.send('done')
            res.render('userManag', {
                active: 'userManag',
                message:'Delete Success',
                error:false,
                existedUser: req.session.user,
                data: ok.map(element=> {
                    element.dateOfBirth = dateFormat(element.dateOfBirth,'dd-mm-yyyy');
                    return element
                })
            });
        }
    }).catch(error => {
        res.send(error)
    });
}else
{
    res.redirect('/');
}

});





adminRoutes.route('/advManag').get((req,res)=>{
        let agentid = null;
        if(req.session.user.userType=='Agent'){
            agentid = req.session.user.id;
        }
        let userid = null;
        if(req.session.user.userType=='User'){
            userid = req.session.user.id;
        }
  authControllers.getAdvsManag(agentid, userid).then((ok,error)=>{
      if(error){
//res.send('error')
res.render('advManag',{
    active: 'advManag',
    existedUser: req.session.user,
    message:'There is an Error',
    error:true,
    data: ok.map(element=> {
        element.date = dateFormat(element.date,'dd-mm-yyyy');
        return element
    })       
})
      }else{
        //   data = ok.filter(element=>{
        //     return Math.round((((new Date(element.date) - Date.now()) % 86400000) % 3600000) / 60000)>5; 
        //   })
        res.render('advManag',{
            active: 'advManag',
            existedUser: req.session.user,
            message:'',
            error:false,
            data: ok.map(element=> {
                element.date = dateFormat(element.date,'dd-mm-yyyy');
                return element
            })       
        })
      }
  }).catch(error => {
    res.send(error)
});

})


adminRoutes.route('/advEdit/:id').get((req,res)=>{
    let done = req.query.done;
    let message="";
    if(done){
        message="Your advertisement updated successfully";
    }

    const advId =req.params.id
    authControllers.getAdv(advId).then((data) => {
        //if statement: this (if)  protects from injection attacks e.g  /advEdit/:22
        
        if(data[0].length>0){
            
        let adv = data[0][0];
        let checkAuth = true;
        if(req.session.user.userType=='Agent'){
            if(adv.agent_ID){
                if(adv.agent_ID != req.session.user.id){
                    checkAuth=false;
                }
            }
           
        }
        if(req.session.user.userType=='User'){
                if(adv.userID != req.session.user.id){
                    checkAuth=false;
                }
           
        }
        if(checkAuth){
            
        
        authControllers.getAgents().then(agents=>{
            let obj={
                id:adv.id,
                address1:adv.address1,
                address2:adv.address2,
                city:adv.city,
                country:adv.country,
                date:dateFormat( Date.parse(adv.date),'yyyy-mm-dd hh:MM:ss'),
                description:adv.description,
                district:adv.district,
                forSell:adv.forSell,
                houseNumber:adv.houseNumber,
                postalCode:adv.postalCode,
                title:adv.title,
                price:adv.price,
                published:adv.published,
                userID:adv.userID,
                paths:[],
                props:[],
                agents,
                agentid:adv.agent_ID,
            }
            data[1].forEach(img => {
                obj.paths.push(img.path)
            });
            data[2].forEach(prop => {
                obj.props.push({
                    prop_name:prop.prop_name,
                    prop_value:prop.prop_value
                })
            });
            console.log(obj)
            res.render('advEdit', {
                active: 'advEdit',
                existedUser: req.session.user,
                message:message,
                error:false,
                advEdit: obj

            });

        }).catch(error=>{
            res.send(error);
        })
    }
        else{
            res.redirect('/');
        }
            
        }else{
            //res.send('could not found');
            res.render('advEdit', {
                active: 'advEdit',
                existedUser: req.session.user,
                message:'There is no Data',
                error:true,
                advEdit: obj


            });
        }
        
    }).catch(error => {
        res.send(error)
    });


});

// handler for publishAdv

// multer config
const storagee = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});
const uploadd = multer({ storage: storagee });
adminRoutes.use('/advEdit', uploadd.array('UploadToDB', 10));


//end multer config

adminRoutes.route('/advEdit').post((req,res)=>{
    // let bDate = new Date(Date.now())
    // var day = bDate.getDate();
    // var monthIndex = bDate.getMonth();
    // var year = bDate.getFullYear();
    let published = false;
    let agentId = null;
    let userId = null;
    if(req.session.user.userType == 'Admin'){
        published = true;
        if(req.body.agentsSelect){
            agentId = req.body.agentsSelect;
        }
    }else{
        if(req.session.user.userType == 'Agent'){
            published = true;
            agentId = req.session.user.id;
        }else{
            if(req.session.user.userType == 'User'){
                published = false;
                userId= req.session.user.id;
            }
        }

    }
    authControllers.UpdateAdv(req.body.advId,req.body.userID,req.body.forSell,req.body.country,req.body.city,req.body.district,req.body.title,req.body.postalCode,req.body.address1,req.body.address2,req.body.houseNumber,req.body.description,req.body.price, req.body.advdate, published, agentId, userId).then(check => {
        if(check){

            let promises = [];

            if(req.body.deletedImgs){
                req.body.deletedImgs.split(',').forEach(element => {
                    promises.push(authControllers.deleteImg(element, req.body.advId))
                });
                 
            }
            if(req.files.length){
                promises.push(authControllers.addadvertisementImages(req.files, req.body.advId))
            }
            

             if (req.body.tags) {
                promises.push(authControllers.insertCheckBoxDetails('tags', req.body.tags,req.body.advId));
             }


            if(req.body.props){
                let props = JSON.parse(req.body.props);
                props.forEach(prop => {
                    // promises.push(authControllers.updateDetails(prop.propName,prop.propValue,req.body.advId));
                    if(prop.propName){
                    promises.push( authControllers.insertCheckBoxDetails(prop.propName, prop.propValue, req.body.advId));
                    }      
                });
            }

            Promise.all(promises).then(datas=>{
                //res.redirect('your advertisement added successfully');
                res.redirect(req.get('referer')+"?done=1");
            //    res.render('advEdit', {
            //     active: 'advEdit',
            //     existedUser: req.session.user,
            //     message:'The advertisement edited successfully',
            //     error:false,
            //     advEdit: obj

            //});
            }).catch(errors=>{
                res.send(errors);
            }) 
        }else{
            res.sent('not ok ')
        //    res.render('advEdit', {
        //     active: 'advEdit',
        //     existedUser: req.session.user,
        //     message:'There is an Error',
        //     error:true,
        //     advEdit: obj

        // });
        }
    }).catch(error => {
        res.send(error)
    });
})


    

module.exports = adminRoutes