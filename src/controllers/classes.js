const { sqlQuery } = require('./sql');



class Advertisements {
    constructor(id, country, city, district, postalCode, address1, address2, houseNumber, forSell, date, userID) {
        this.Id = id;
        this.Country = country;
        this.City = city;
        this.District = district;
        this.postalCode = postalCode;
        this.Address1 = address1;
        this.Address2 = address2;
        this.houseNumber = houseNumber;
        this.forSell = forSell;
        this.date = date;
        this.userID = userID;
    }
    getAddress() {
        return this.address1 + " " + this.address2 + " " + this.city + " " + this.state + " " + this.country;
    }
    getOrders() {
        const getPromise = new Promise((resolve, reject) => {
            sqlQuery(`select orders.* from orders inner join customers on orders.customerNumber = customers.customerNumber where customers.customerNumber = ${this.Id} `).then(orders => {
                let allOrders = [];
                console.log(orders);
                orders.forEach(order => {
                    allOrders.push(
                        new Order(order.orderNumber,
                            order.orderDate,
                            order.requiredDate,
                            order.shippedDate,
                            order.status,
                            order.comments,
                            order.customerNumber
                        )
                    );
                });
                resolve(allOrders);

            }).catch(error => {
                reject(error);
            })
        });
        return getPromise;
    }
    save() {
        const savePromise = new Promise((resolve, reject) => {
            sqlQuery(`UPDATE customers SET customerName='${this.companyName}',
        contactLastName='${this.Lname}',contactFirstName='${this.Fname}',
        phone='${this.phone}',
        addressLine1='${this.address1}',
        addressLine2='${this.address2}',
        city='${this.city}',
        state='${this.state}',
        postalCode='${this.postalCode}',
        country='${this.country}',
        salesRepEmployeeNumber=${this.employee},
        creditLimit=${this.creditLimit},
        username='${this.userName}',
        password='${this.password}' 
        WHERE customerNumber = ${this.Id}`).then(data => {
                if (data.length == 0) {
                    reject(null);
                } else {
                    resolve(data);
                }
            }).catch(error => {
                reject(error);
            })
        });
        return savePromise

    }
    //static method
    static getCustomerById(id) {
        const queryPromise = new Promise((resolve, reject) => {
            sqlQuery(`select * from customers where customerNumber = ${id} `).then(customer => {

                if (customer.length == 0) {
                    reject(null);
                } else {
                    let data = customer[0];
                    resolve(new Customer(data.customerNumber,
                        data.customerName,
                        data.contactLastName,
                        data.contactFirstName,
                        data.phone,
                        data.addressLine1,
                        data.addressLine2,
                        data.city,
                        data.state,
                        data.postalCode,
                        data.country,
                        data.salesRepEmployeeNumber,
                        data.creditLimit,
                        data.username,
                        data.password
                    ));
                }
            }).catch(error => {
                reject(error);
            });
        });
        return queryPromise;

    }
    static getAll() {
        const getPromise = new Promise((resolve, reject) => {
            sqlQuery('select * from customers').then(customers => {
                let allCustomers = [];
                customers.forEach(customer => {
                    allCustomers.push(
                        new Customer(customer.customerNumber,
                            customer.customerName,
                            customer.contactLastName,
                            customer.contactFirstName,
                            customer.phone,
                            customer.addressLine1,
                            customer.addressLine2,
                            customer.city,
                            customer.state,
                            customer.postalCode,
                            customer.country,
                            customer.salesRepEmployeeNumber,
                            customer.creditLimit,
                            customer.username,
                            customer.password
                        )
                    );
                });
                resolve(allCustomers);

            }).catch(error => {
                reject(error);
            })
        });
        return getPromise;
    }
    static getPage(pageNumber, elementsNumber) {
        const getPromise = new Promise((resolve, reject) => {
            let startNum = (pageNumber - 1) * 5;
            sqlQuery(`select * from customers limit ${startNum}, ${elementsNumber} `).then(customers => {
                let allCustomers = [];
                customers.forEach(customer => {
                    allCustomers.push(
                        new Customer(customer.customerNumber,
                            customer.customerName,
                            customer.contactLastName,
                            customer.contactFirstName,
                            customer.phone,
                            customer.addressLine1,
                            customer.addressLine2,
                            customer.city,
                            customer.state,
                            customer.postalCode,
                            customer.country,
                            customer.salesRepEmployeeNumber,
                            customer.creditLimit,
                            customer.username,
                            customer.password
                        )
                    );
                });
                resolve(allCustomers);

            }).catch(error => {
                reject(error);
            })
        });
        return getPromise;
    }
}
class UnpublishedAdvertisements {
    constructor(id, country, city, district, postalCode, address1, address2, houseNumber, forSell, date, adv_id, published) {
        this.Id = id;
        this.Country = country;
        this.City = city;
        this.District = district;
        this.postalCode = postalCode;
        this.Address1 = address1;
        this.Address2 = address2;
        this.houseNumber = houseNumber;
        this.forSell = forSell;
        this.date = date;
        this.adv_id = adv_id;
        this.published = published

    }
}
class Users {
    constructor(id, firstName, lastName, dateOfBirth, password, email, mobile, address, verify, active, userType, deleted, verifyNumber) {
        this.Id = id;
        this.FirstName = firstName;
        this.LastName = lastName;
        this.DateOfBirth = dateOfBirth;
        this.Password = password;
        this.Email = email;
        this.Mobile = mobile;
        this.Address = address;
        this.Verify = verify;
        this.Active = active;
        this.UserType = userType;
        this.Deleted = deleted
        this.verifyNumber = verifyNumber

    }
}
class AgentsExtra {
    constructor(id, prop_name, prop_value, userID) {
        this.ID = id;
        this.Prop_name = prop_name;
        this.Prop_value = prop_value;
        this.UserID = userID
    }
}
class AdvDetails {
    constructor(id, prop_name, prop_value, adertisementsID) {
        this.ID = id;
        this.Prop_name = prop_name;
        this.Prop_value = prop_value;
        this.AdertisementsID = adertisementsID
    }
}





module.exports = {
    Advertisements,
    UnpublishedAdvertisements,
    Users,
    AgentsExtra,
    AdvDetails,
}