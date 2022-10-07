const { upload } = require('../middleware/upload')
const db = require("../models")
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const Berita = db.beritas;
const Komentar = db.komentars;
const User = db.users;
const Op = db.Sequelize.Op;

module.exports = {
    Query: {
        beritas: () => {
            return Berita.findAll() //async
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return err;
                });
        },
        komentars: () => {
            return Komentar.findAll()
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return err;
                });
        },
        users: (parent, args, context) => {
            //console.log(context.data.id);
            if (!context.data)
                return [];
            else
                return User.findAll()
                    .then(users => {
                        return users;
                    })
                    .catch(err => {
                        return [];
                    });
        }
    },
    Mutation: {
        createBerita: async (_, { title, highlight, content, image }, context) => {
            if (!context.data) {// Not authenticated
                return [];
            } else {
                // Middleware upload
                const imageUrl = await upload(image)

                try {
                    var berita = {
                        title: title,
                        highlight: highlight,
                        content: content,
                        image: imageUrl
                    }

                    return Berita.create(berita)
                        .then(() => {
                            return berita;
                        });
                } catch (error) {
                    return {};
                }
            }

        },
        updateBerita: async (_, { id, title, highlight, content, image }, context) => {
            if (!context.data) {// Not authenticated
                return [];
            } else {
                // Middleware upload
                const imageUrl = await upload(image)
                try {
                    // Middleware upload
                    const imageUrl = await upload(image)

                    var berita = {
                        title: title,
                        highlight: highlight,
                        content: content,
                        image: imageUrl
                    }

                    Berita.update(berita, {
                        where: { id: id }
                    })
                        .then(() => {
                            return Berita.findByPk(id);
                        });

                } catch (error) {
                    return {};
                }
            }

        },
        getBerita: (parent, { id }) => {
            // Get Berita By Id
            return Berita.findByPk(id) //async
                .then(berita => {
                    return berita;
                })
                .catch(err => {
                    return {};
                });
        },
        deleteBerita: (parent, { id }, context) => {
            if (!context.data) {// Not authenticated
                return [];
            } else {
                // Soft Delete
                try {
                    var berita = {
                        isDelete: true,
                    }

                    return Berita.update(berita, {
                        where: { id: id }
                    })
                        .then(() => {
                            return Berita.findByPk(id)
                        });
                } catch (error) {
                    return {}
                }
            }

        }, createKomentar: (parent, { id, text }) => {
            // Params id disini adalah id berita yang memiliki komentar tersebut
            try {
                var komentar = {
                    text: text,
                    beritumId: id
                }

                return Komentar.create(komentar)
                    .then(() => {
                        return komentar;
                    });

            } catch (error) {
                return {};
            }
        }, replyKomentar: (parent, { id, text }) => {
            // Params id disini adalah idParent komentar tersebut
            try {
                var komentar = {
                    text: text,
                    komentarId: id // foreign key ke parent
                }

                return Komentar.create(komentar)
                    .then(() => {
                        return komentar
                    });

            } catch (error) {
                return {};
            }
        }, register: (parent, { name, email, username, password }) => {
            var hashpass = bcrypt.hashSync(password, 8);
            var user = {
                name: name,
                email: email,
                username: username,
                password: hashpass
            }
            return User.create(user)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },
        login: (parent, { username, password }) => {
            return User.findOne({ where: { username: username } })
                .then(data => {
                    if (data) {
                        var loginValid = bcrypt.compareSync(password, data.password);
                        if (loginValid) {

                            var payload = {
                                userid: data.id,
                                username: username
                            };
                            let token = jwt.sign(
                                payload,
                                config.secret, {
                                expiresIn: '3h'
                            }
                            );
                            let dt = new Date(); // now
                            dt.setHours(dt.getHours() + 3); // now + 3h

                            return {
                                success: true,
                                token: token,
                                expired: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString()
                            };
                        } else {
                            return {};
                        }
                    } else {
                        return {};
                    }
                })
                .catch(err => {
                    console.log(err);
                    return {};
                });
        },
    },

};