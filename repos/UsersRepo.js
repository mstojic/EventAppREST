let fs = require('fs');
let FILE_PATH = './assets/users.json'
let UsersRepo = {
    get: function (resolve, reject) {
        fs.readFile(FILE_PATH, function (error, data) {
            if (error) {
                reject(error);
            }
            else {
                resolve(JSON.parse(data));
            }
        })
    },
    getByID: function (id, resolve, reject) {
        fs.readFile(FILE_PATH, function (error, data) {
            if (error) {
                reject(error);
            }
            else {
                let users = JSON.parse(data);
                let user = users.find((u) => u.id == id)
                resolve(user);
            }
        })
    },
    insert: function (user, resolve, reject) {
        fs.readFile(FILE_PATH, function (error, data) {
            if (error) {
                reject(error);
            }
            else {
                let users = JSON.parse(data);
                if (user) {
                    users.push(user);
                }
                fs.writeFile(FILE_PATH, JSON.stringify(users), function () {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(user);
                    }
                });
            }
        })
    },
    update: function (id, newUserData, resolve, reject) {
        fs.readFile(FILE_PATH, function (error, data) {
            if (error) {
                reject(error);
            }
            else {
                let users = JSON.parse(data);
                let user = users.find((u) => u.id == id);

                if (user) {
                    Object.assign(user, newUserData);
                }
                else {
                    let ex = new Error("User not found");
                    reject(ex);
                    return;
                }
                fs.writeFile(FILE_PATH, JSON.stringify(users), function () {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(user);
                    }
                });
            }
        })
    },
    delete: function (id, resolve, reject) {
        fs.readFile(FILE_PATH, function (error, data) {
            if (error) {
                reject(error);
            }
            else {
                let users = JSON.parse(data);
                let index = users.findIndex((u) => u.id == id);
                if(index > -1){
                    users.splice(index, 1)
                }
                else {
                    let ex = new Error("User not found");
                    reject(ex);
                    return;
                }
                fs.writeFile(FILE_PATH, JSON.stringify(users), function () {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("User got deleted");
                    }
                });
            }
        })
    }

}
module.exports = UsersRepo;