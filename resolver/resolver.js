const { upload } = require('../middleware/upload')
const db = require("../models")

const Berita = db.beritas;
const Komentar = db.komentars;
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
        }
    },
    Mutation: {
        createBerita: async (_, { title, highlight, content, image }) => {
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
                        return data;
                    });
            } catch (error) {
                return {};
            }
        },
        updateBerita: async (_, { id, title, highlight, content, image }) => {
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
        deleteBerita: (parent, { id }) => {
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
        },
    },

};