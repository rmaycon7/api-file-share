const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

// {  "name": "jiren",  "email": "jose@email.com",  "password": "teste"}




// rota para listar todos os usuários


exports.getAll = async (req, res, next) => {
    const query = User.find()
    query.exec(async (error, docs) => {
        if (docs) {


            const users = docs.map(doc => {
                return {
                    id: doc._id,
                    name: doc.name,
                    email: doc.email
                }
            })
            return res.status(200).send({
                users
            });
        } else return res.status(404).send({
            error: "No users found."
        });
    });
};


exports.getById = async (req, res, next) => {
    const query = User.findById(req.params.userId)
    query.exec(async (error, doc) => {
        if (doc) {


            const user = {
                id: doc._id,
                name: doc.name,
                email: doc.email
            };
            return res.status(200).send({
                user
            });
        } else return res.status(404).send({
            error: "User not found."
        });
    });
};

exports.create = async (req, res, next) => {
    try {
        // console.log(req.body);
        const {
            email
        } = req.body;

        // verificando se os dados de cadastro do usário não estão vazios
        if (!req.body.name || !req.body.password || !req.body.email) {
            return res.status(428).send({
                error: "Email, password or name  is null, but can not be null."
            });
        }

        // verificando se o email ja esta cadastrado no sistema, ou seja, se o usuário ja existe
        if (await User.findOne({
                email
            })) {
            return res.status(409).send({
                error: "email is already in using!!"
            });
        }
        // criando usuário
        User.create(req.body, (error, user) => {
            // console.clear()
            // console.log(user)
            if (error) {
                return res.status(500).send({
                    error: "Intenal error, please try again."
                });
            }
            const response = {
                id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken({
                    id: user._id
                })
            };
            return res.status(200).send(
                response
            );
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Registration failed, please tray again."
        });
    }
};

// Rota para atualizar usuários
exports.update = async (req, res, next) => {
    const {
        name,
        password,
        email
    } = req.body;
    // console.clear()
    // console.log({ name, password, email })
    if (!name || !password || !email) {
        return res.status(428).send({
            error: "Email, password or name  is null, but can not be null."
        });
    }

    User.findByIdAndUpdate(
        req.params.userId, {
            name,
            password,
            email

        }, {
            new: true
        },
        (error, user) => {
            // console.log(user)
            if (error)
                return res.status(404).send({
                    message: "User not found."
                });
            else
                return res.send({
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
        }
    ).catch((error) => {
        return res.status(404).send({
            message: "User not found."
        });
    })
};

exports.delete = async (req, res, next) => {
    try {
        const user = await User.findByIdAndRemove(req.params.userId);
        if (!user) {
            return res.status(410).send({
                message: "Cannot delete user, because he's gone."
            });
        }
        const response = {
            message: "User delete successfull."
        };
        return res.status(202).send({
            response
        });
    } catch (error) {
        console.log(error);

        return res.status(404).send({
            message: "User not found."
        });
    }
};