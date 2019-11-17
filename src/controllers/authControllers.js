const sqlQuery = require('./sql');
const emaiVerifier = require('./emailVerfiy');
const fs = require('fs');
const path = require('path');


function addUser(firstName, lastName, dateOfBirth, password, email, mobile, address, file, host) {
    const addPromise = new Promise((resolve, reject) => {
        let rand = Math.floor((Math.random() * 100) + 54); //????

        sqlQuery.sqlQuery(
            "INSERT INTO `Users` (`firstName`,`lastName`,`dateOfBirth`,`password`,`email`,`mobile`,`address`,`imgUrl`,`verify`, `active`, `userType`, `deleted`, `verifyNumber` ) VALUES ('" + firstName + "', '" + lastName + "', '" + dateOfBirth + "', '" + password + "', '" + email + "', " + mobile + ", '" + address + "', " + "'/profiles/" + file.filename + "', " + false + ", " + true + ", " + "'User'" + ", " + false + "," + rand + ")"
        ).then(data => {
            emaiVerifier.sendverifyEmail(email, rand, host).then(respo => {
                resolve(data);
            }).catch(error => {
                reject(error)
            });



        }).catch(error => {
            reject(error);
        })

    });
    return addPromise;
}


function checkEmail(email) {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
            "SELECT `email` FROM `Users` WHERE `email`='" + email + "'"
        ).then(data => {
            console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}








// check login



function checkUserforlogin(email, password) {
    const addPromise = new Promise((resolve, reject) => {


        sqlQuery.sqlQuery(
            // SELECT * FROM `Users` WHERE `email`='zaghmut.basel@web.de' AND `password`='787'

            "SELECT * FROM Users WHERE email = '" + email + "' AND password = '" + password + "'"
        ).then(data => {
            // console.log(data)
            // if (data.length) {
                resolve(data[0])

            // } 
            
            // else {
            //     reject()   
            // }


        }).catch(error => {
            reject(error);
        })

    });
    return addPromise;
}



function addAddvertisement(forSell, country, city, district, title, postalCode, address1, address2, houseNumber, description, price, date, userid) {
    const addPromise = new Promise((resolve, reject) => {

        const query = "INSERT INTO `Advertisements`(`forSell`,`country`,`city`,`district`,`title`,`postalCode`,`address1`, `address2`, `houseNumber`, `description`,`price`, `date`, `userID`,`published`) VALUES ('" + forSell + "', '" + country + "', '" + city + "', '" + district + "', '" + title + "', '" + postalCode + "', '" + address1 + "', '" + address2 + "', '" + houseNumber + "','" + description + "'," + price + ",'" + date + "'," + userid + "," + false + ")";

        sqlQuery.sqlQuery(
            query
        ).then(data => {
            resolve(data);
            // res.send('inserted')

        }).catch(error => {
            reject(error);
        })

    });
    return addPromise;

}

function addadvertisementImages(files, advid) {
    const addPromise = new Promise((resolve, reject) => {
        let insertComands = "insert into Images (path, AdvertisementID, published) values";
        for (let i = 0; i < files.length; i++) {
            insertComands += ' ("' + "/uploads/" + files[i].filename + '", ' + advid + ', ' + false + ')';
            if (i !== files.length - 1) {
                insertComands += ',';
            }

        }

        insertComands += ";";
        sqlQuery.sqlQuery(insertComands).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise

}

// right code

// function changePassword(newPassword,userid) {
//     const addPromise = new Promise((resolve, reject) => {
//         sqlQuery.sqlQuery(
//             "UPDATE `Users` SET `password`='" + newPassword + "'WHERE `id`='" + userid + "'"
//         ).then(data => {
//             console.log(data)
//                 resolve(data)
//         }).catch(error => {
//             reject(error);
//         })
//     });
//     return addPromise;
// }


function changePassword(newPassword, userid) {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
            "UPDATE `Users` SET `password`='" + newPassword + "'WHERE `id`='" + userid + "'"
        ).then(data => {
            console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}

/**
 * this function compares the enterd old password with the current password in db.
 * @param {String} oldPassword 
 * @param {Number} userid 
 */
function checkOldPassword(oldPassword, userid) {
    const addPromise = new Promise((resolve, reject) => {
        let query = "SELECT `password` FROM `Users` WHERE `id`='" + userid + "'AND `password`='" + oldPassword + "'"
        sqlQuery.sqlQuery(
            query
        ).then(data => {
            console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}


function showAgents(d) {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
            "select Users.*,count(Advertisements.id) as agentAdvCount   from Users inner join Advertisements on Advertisements.agent_ID = Users.id where Users.userType='Agent' AND verify=1 AND active=1 group by Advertisements.agent_ID"
        ).then(data => {

            console.log(data)
            //  data=Array()
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}


function getUser(userid) {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
            "select firstName,lastName,dateOfBirth,password,mobile,address,imgUrl from Users WHERE `id`=" + userid + ""
        ).then(data => {

            console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}


function getUsers() {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
            "select id , firstName,lastName,dateOfBirth,email,mobile,password,active,address,userType from Users order by userType "
        ).then(data => {

            console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}

function changePersonalInfo(firstName, lastName, dateOfBirth, password, mobile, address, file, userid) {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(

            //  "UPDATE `Users` SET `password`='" + newPassword + "'WHERE `id`='" + userid + "'"
            "UPDATE `Users` SET firstName='" + firstName + "'," + "lastName='" + lastName + "'," + "dateOfBirth='" + dateOfBirth + "'," + "password='" + password + "'," + "mobile='" + mobile + "'," + "address='" + address + "'" + (file != null ? ", imgUrl='" + file + "'" : "") + " WHERE `id`=" + userid + ""

        ).then(data => {
            console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}

function updateUserInfo(firstName, lastName, dateOfBirth, password, mobile, address, userid) {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
            "UPDATE `Users` SET firstName='" + firstName + "'," + "lastName='" + lastName + "'," + "dateOfBirth='" + dateOfBirth + "'," + "password='" + password + "'," + "mobile='" + mobile + "'," + "address='" + address + "'  WHERE `id`=" + userid + ""
        ).then(data => {
            console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}



function deleteUserInfo(ID) {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
            "UPDATE Users SET active=0,deleted=1 WHERE id=" + ID + ""

            // "UPDATE `Users` SET `active`=" + false + "," +"`deleted`=" + false + "WHERE `id`=" + ID + "'"
        ).then(data => {
            console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}

function insertDetails(propertyName, propertyValue, advId) {
    const savePromise = new Promise((resolve, reject) => {
        var query = `INSERT into AdvDetails(prop_name,prop_value,advertisementID) VALUES ("${propertyName}","${propertyValue}",${advId}) `;


        sqlQuery.sqlQuery(query).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        })
    });
    return savePromise;

}

function getAdvsManag(agentID, userid) {
    const savePromise = new Promise((resolve, reject) => {
        var query = "SELECT id,city,district,postalCode,address1,date,country,userID,published from Advertisements ORDER BY published ASC, date DESC";
        if(agentID){
            query = "SELECT id,city,district,postalCode,address1,date,country,userID,published from Advertisements where (agent_ID = "+agentID+" OR agent_ID IS NULL )  ORDER BY published ASC, date DESC";
        }
        if(userid){
            query = "SELECT id,city,district,postalCode,address1,date,country,userID,published from Advertisements where userID = "+userid+"    ORDER BY published ASC, date DESC";
        }
        


        sqlQuery.sqlQuery(query).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        })
    });
    return savePromise;
}


function getAdv(ID) {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
            "SELECT * FROM Advertisements WHERE id=" + ID + "; " + "SELECT * FROM Images WHERE AdvertisementID=" + ID + "; " + "SELECT * FROM AdvDetails WHERE advertisementID=" + ID + "; "
            // we need to add (multipleStatements: true)to sql file to enable multi select query
        ).then(data => {

            console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}






function UpdateAdv(advid, userID, forSell, country, city, district, title, postalCode, address1, address2, houseNumber, description, price, date, published, agentId, userId) {
    const addPromise = new Promise((resolve, reject) => {

        const query = `UPDATE Advertisements SET forSell="${forSell}",country="${country}",city="${city}",district="${district}",title="${title}",postalCode="${postalCode}",address1="${address1}",address2="${address2}",houseNumber="${houseNumber}",description="${description}",price=${price},date="${date}",userID=${userID} ,published=${published?"1":"0"} ${userId==null?", agent_ID = "+agentId+"":""} WHERE id=${advid}; delete from AdvDetails WHERE advertisementID=${advid} ; `;

        sqlQuery.sqlQuery(
            query
        ).then(data => {
            if(published){
                sqlQuery.sqlQuery(`select * from Published_Advertisements where adv_id = ${advid}`).then(foundPublished=>{
                    if(foundPublished.length){
                        sqlQuery.sqlQuery(`UPDATE Published_Advertisements SET country="${country}",city="${city}",district="${district}",title="${title}",description="${description}",postalCode="${postalCode}",address1="${address1}",address2="${address2}",houseNumber="${houseNumber}",forSell="${forSell}" ,price="${price}" WHERE adv_id=${advid}`).then(data=>{
                            resolve(data);
                        }).catch(error=>{
                            reject(error);
                        })
                    }else{
                        sqlQuery.sqlQuery(`INSERT INTO Published_Advertisements( country, city, district, title, description, postalCode, address1, address2, houseNumber, forSell, date, adv_id, price) VALUES ( "${country}", "${city}", "${district}", "${title}", "${description}", "${postalCode}", "${address1}", "${address2}", "${houseNumber}", "${forSell}", "${date}", ${advid}, "${price}")`).then(data=>{
                            resolve(data);
                        }).catch(error=>{
                            reject(error);
                        })
                    }
                }).catch(error=>{
                    reject(error);
                })
                
            }else{
                resolve(data);
            }
            
            // res.send('inserted')

        }).catch(error => {
            reject(error);
        })

    });
    return addPromise;

}




function updateCheckBoxDetails(propertyName, propertyValue, advId) {
    const savePromise = new Promise((resolve, reject) => {

        const query = `UPDATE AdvDetails SET prop_value="${propertyValue}" WHERE advertisementID=${advId} AND prop_name like '${propertyName}'`;


        sqlQuery.sqlQuery(query).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        })
    });
    return savePromise;

}



function delCheckBoxDetails(advId) {
    const savePromise = new Promise((resolve, reject) => {

        const query = `DELETE FROM AdvDetails  WHERE advertisementID=${advId} AND prop_name='tags'`;


        sqlQuery.sqlQuery(query).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        })
    });
    return savePromise;

}

function insertCheckBoxDetails(prop_Name, prop_value, advId) {
    
    const savePromise = new Promise((resolve, reject) => {
        checkProperty(prop_Name, advId).then(data => {
            if (data.length) {
                updateCheckBoxDetails(prop_Name, prop_value, advId).then(updatedData => {
                    resolve(updatedData);
                }).catch(error => {
                    reject(error);
                })
            } else {
                const query = `INSERT INTO AdvDetails(prop_name,prop_value,advertisementID) VALUES('${prop_Name}','${prop_value}',${advId})`;


                sqlQuery.sqlQuery(query).then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                })
            }
        }).catch(error => {
            reject(error);
        })

    });
    return savePromise;

}


function checkProperty(prop_Name, advId) {
    const savePromise = new Promise((resolve, reject) => {

        const query = `SELECT prop_name FROM AdvDetails WHERE prop_name='${prop_Name}' AND advertisementID=${advId} `;


        sqlQuery.sqlQuery(query).then(data => {
            
                resolve(data);
            

        }).catch(error => {
            reject(error);
        })
    });
    return savePromise;

}


function updateDetails(propertyName, propertyValue, advId) {
    const savePromise = new Promise((resolve, reject) => {

        // const query=`UPDATE AdvDetails SET prop_name="${propertyName}",prop_value="${propertyValue}" WHERE advertisementID=${advId}`;
        const query = `UPDATE AdvDetails SET prop_value="${propertyValue}" WHERE advertisementID=${advId} AND prop_name="${propertyName}"`;

        sqlQuery.sqlQuery(query).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        })
    });
    return savePromise;

}
function deleteImg(imgPath, advId) { 
    const deletePromise = new Promise((resolve, reject)=>{
        let url = path.join(__dirname,"/public"+imgPath);
        if(fs.existsSync(url.replace('/src/controllers').replace('\\src\\controllers',''))){
            fs.unlink(url.replace('/src/controllers','').replace('\\src\\controllers',''), (err)=>{
                if(err){
                    reject(err);
                }else{
                    sqlQuery.sqlQuery(`delete from Images where AdvertisementID = ${advId} and path like '${imgPath}'`).then(data=>{
                        resolve();
                    }).catch(error=>{
                        reject(error);
                    })
                }
                // path:"/home/basel/Desktop/28.10.2019/src/routes/public/profiles/1572352332410-img_1.jpg"

            });
        }else{
            sqlQuery.sqlQuery(`delete from Images where AdvertisementID = ${advId} and path like '${imgPath}'`).then(data=>{
                resolve();
            }).catch(error=>{
                reject(error);
            })
        }
                
    });
    return deletePromise;
 }

function getAgents(){
    const getPromise = new Promise((resolve, reject) => {

        // const query=`UPDATE AdvDetails SET prop_name="${propertyName}",prop_value="${propertyValue}" WHERE advertisementID=${advId}`;
        const query = `select id, CONCAT(firstName,' ',lastName) as name from Users where userType like "Agent"`;

        sqlQuery.sqlQuery(query).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        })
    });
    return getPromise;
}
function getPublishedAdvs() {
    const getPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
            "SELECT   imgs.AdvertisementID,Published_Advertisements.id, Published_Advertisements.title, Published_Advertisements.forSell, Published_Advertisements.city, Published_Advertisements.district, Published_Advertisements.price,  imgs.path FROM Published_Advertisements inner join Images as imgs on imgs.AdvertisementID = Published_Advertisements.adv_id where imgs.id = (select min(Images.id) from Images where Images.AdvertisementID = Published_Advertisements.adv_id )"
            // we need to add (multipleStatements: true)to sql file to enable multi select query
        ).then(data => {

            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return getPromise;
  }


  function getPublishedAdvsTOP9() {
    const getPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
            "SELECT   imgs.AdvertisementID,Published_Advertisements.id, Published_Advertisements.title, Published_Advertisements.forSell, Published_Advertisements.city, Published_Advertisements.district, Published_Advertisements.price,  imgs.path FROM Published_Advertisements inner join Images as imgs on imgs.AdvertisementID = Published_Advertisements.adv_id where imgs.id = (select min(Images.id) from Images where Images.AdvertisementID = Published_Advertisements.adv_id ) order by Published_Advertisements.date DESC limit 9"
        ).then(data => {

            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return getPromise;
  }

function search(tags, forsell, country, city, district, postalCode, keyWord, minPrice, maxPrice) {
    const getPromise = new Promise((resolve, reject) => {
    let query = `SELECT Published_Advertisements.id , imgs.AdvertisementID, Published_Advertisements.title, Published_Advertisements.forSell, Published_Advertisements.city, Published_Advertisements.district, Published_Advertisements.price,  imgs.path FROM Published_Advertisements inner join Images as imgs on imgs.AdvertisementID = Published_Advertisements.adv_id where imgs.id = (select min(Images.id) from Images where Images.AdvertisementID = Published_Advertisements.adv_id ) AND Published_Advertisements.forSell like "${forsell}" ${country?'AND Published_Advertisements.country LIKE "'+country+'"':''} ${city?'AND Published_Advertisements.city LIKE "'+city+'"':''} ${district?'AND Published_Advertisements.district LIKE "'+district+'"':''} ${postalCode?'AND Published_Advertisements.postalCode LIKE "'+postalCode+'"':''} ${keyWord?'AND (Published_Advertisements.title LIKE "'+keyWord+'" OR Published_Advertisements.title LIKE "%'+keyWord+'" OR Published_Advertisements.title LIKE "%'+keyWord+'%" OR Published_Advertisements.title LIKE "'+keyWord+'%" OR Published_Advertisements.description LIKE "'+keyWord+'" OR Published_Advertisements.description LIKE "%'+keyWord+'" OR Published_Advertisements.description LIKE "%'+keyWord+'%" OR Published_Advertisements.description LIKE "'+keyWord+'%")':''} ${minPrice?'AND Published_Advertisements.price > '+minPrice:''} ${maxPrice?'AND Published_Advertisements.price < '+maxPrice:''}   order by Published_Advertisements.date DESC `;
    sqlQuery.sqlQuery(query).then(data=>{
        resolve(data)
    }).catch(error => {
        reject(error);
    })
});
return getPromise;

  }


  function AgentSinglePage(advId) {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
          `SELECT *
          FROM ((Users
          INNER JOIN Advertisements ON Users.id=Advertisements.agent_ID)
          INNER JOIN Published_Advertisements ON Advertisements.id=Published_Advertisements.adv_id)
          where Published_Advertisements.id=${advId};SELECT Images.path FROM Images inner join Advertisements on Advertisements.id = Images.AdvertisementID inner join Published_Advertisements on Advertisements.id = Published_Advertisements.adv_id  WHERE Published_Advertisements.id=${advId} ;SELECT AdvDetails.prop_name,AdvDetails.prop_value FROM AdvDetails inner join Advertisements on Advertisements.id = AdvDetails.AdvertisementID inner join Published_Advertisements on Advertisements.id = Published_Advertisements.adv_id  WHERE Published_Advertisements.id=${advId} ; `
        ).then(data => {

            console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}

function getAdvCount(agentId) {
    const addPromise = new Promise((resolve, reject) => {
        sqlQuery.sqlQuery(
          `SELECT COUNT(*) as "agentAdvCount" FROM Advertisements WHERE agent_ID=${agentId}`
        ).then(data => {
            //console.log(data)
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    });
    return addPromise;
}





module.exports = {
    addUser,
    checkUserforlogin,
    addAddvertisement,
    addadvertisementImages,
    changePassword,
    checkOldPassword,
    showAgents,
    checkEmail,
    getUser,
    getUsers,
    updateUserInfo,
    deleteUserInfo,
    changePersonalInfo,
    insertDetails,
    getAdvsManag,
    getAdv,
    UpdateAdv,
    updateCheckBoxDetails,
    delCheckBoxDetails,
    insertCheckBoxDetails,
    checkProperty,
    updateDetails,
    deleteImg,
    getAgents,
    getPublishedAdvs,
    getPublishedAdvsTOP9,
    AgentSinglePage,
    search,
    getAdvCount



};