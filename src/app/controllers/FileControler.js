"use-strict";
const express = require("express");
const router = express.Router();
// const fs = require('fs');
const multer = require("multer");

// const test = require('exp')

const fs = require("fs");

const path = require("path");

let upload = multer({
    dest: "uploads/"
}).array("files", 200);

// console.log(upload.dest);


const File = require("../models/File");

function checkType(file) {
    let posi = file.length - file.split(".")[file.split(".").length - 1].length;
    // console.log(file.slice(file.split('.')[file.split('.').length - 1], posi - 1))
    // console.log(file.split('.').length);
    // console.log(file.split('.')[file.split('.').length - 1])
    let extention = file.split(".")[file.split(".").length - 1];
    // console.log(extention)
    let docs = [
        "txt",
        "doc",
        "docx",
        "pdf",
        "pptx",
        "odt",
        "fodt",
        "ott",
        "out",
        "xls",
        "srt",
        "html",
        "htm",
        "php",
        "js",
        "rb", ,
        "py",
        "c", ,
        "cpp"
    ];
    let images = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "ico",
        "xdm",
        "bitmap",
        "bmp",
        "xpm",
        "psd",
        "jpe",
        "pgm",
        "pnm",
        "svg"
    ];
    let videos = [
        "mp4",
        "mkv",
        "3gp",
        "mov",
        "avi",
        "wmv",
        "3g2",
        "flv",
        "rm",
        "mpg",
        "vob",
        "rmvb",
        "webm"
    ];
    let comprimidos = ["zip", "7z", "tar", "xz", "gz", "rar", "bin", "iso"];
    let musicas = ["mp3", "acc", "m4a", "wav", "wma", "alac", "flac"];

    if (runc(docs, extention)) {
        return {
            type: "doc"
        };
    } else if (runc(images, extention)) {
        return {
            type: "image"
        };
    } else if (runc(videos, extention)) {
        return {
            type: "video"
        };
    } else if (runc(comprimidos, extention)) {
        return {
            type: "compress"
        };
    } else if (runc(musicas, extention)) {
        return {
            type: "music"
        };
    } else {
        return {
            type: "other"
        };
    }
    // verificando a existencia da extensão em um array

    function runc(types, type) {
        let i = 0;
        while (i < types.length) {
            if (types[i] === type) {
                return true;
            }
            i++;
        }
        return false;
    }
}

// let checkType = async (filename, cont) =>{
//     File.find(filename, (error, file)=>{
//         if(!file){
//             return filename
//         }
//         else{
//             let extention = file.split(".")[file.split(".").length - 1];

//         }
//     })
//     return ;
// }

exports.listAll = async (req, res, next) => {
    try {
        File.find()
            .select("originalname size _id type")
            .sort({
                originalname: 1
            })
            .then(files => {
                // files.sort()
                // console.log(
                //     files.filter(file => {
                //         return file.type === 'image'
                //     })
                // );
                const types = ["doc", "image", "video", "compress", "music", "other"].sort()
                const response = types.map(ftype => {
                    let aux = files.filter(file => {
                        return file.type === ftype
                    })
                    return {
                        type: ftype,
                        files: aux.map(auxfile => {
                            return {
                                id: auxfile._id,
                                filename: auxfile.originalname,
                                filesize: auxfile.size
                            }
                        })
                    }
                })






                // response = files.map(file => {

                //     return {
                //         id: file._id,
                //         filename: file.originalname,
                //         filesize: file.size,
                //         type: file.type
                //     };
                // });
                // response.type.sort()
                return res.status(200).send(
                    response
                );
            });
    } catch (e) {
        // statements
        return res.status(500).send({
            error: e
        });
        // console.log(e);
    }
};

exports.listCategory = async (req, res, next) => {
    try {
        let type = req.params.nameType;
        type.toLowerCase();
        File.find({
                type: type.toLowerCase()
            })
            .sort({
                type: 1
            })
            .then(files => {
                files = files || [];
                const response = files.map(file => {
                    return {
                        id: file._id,
                        filename: file.originalname,
                        filesize: file.size,
                        type: file.type
                    };
                });
                if (response.length === 0) {
                    return res.status(404).send({
                        error: "No " + type.toLowerCase() + " found."
                    });
                }
                // console.log(response);

                return res.status(200).send(
                    response
                );
            })
            .catch(erro => {
                // console.log(erro);

                return res.status(404).send({
                    error: "Type not found!"
                });
            });
    } catch (e) {
        // statements
        return res.status(500).send({
            error: e
        });
        // console.log(e);
    }

    // res.send({ ok: true , nameType: req.params.nameType})
};

exports.download = async (req, res, next) => {
    // var options = {
    // root: __dirname + '/public/',
    // dotfiles: 'deny',
    // headers: {
    // 'x-timestamp': Date.now(),
    // 'x-sent': true
    // }
    // };

    // var fileName = req.params.name;
    // res.sendFile(fileName, options, function (err) {
    // if (err) {
    // next(err);
    // } else {
    // console.log('Sent:', fileName);
    // }
    // });

    try {
        console.log(req.params.fileId)
        File.findById(req.params.fileId)
            .exec()
            .then(file => {
                let options = {
                    root: file.path,
                    dotfiles: "deny",
                    headers: {
                        "x-timestamp": Date.now(),
                        "x-sent": true
                    },
                    acceptRanges: true
                };
                // let aux = "Content-Disposition: attachment; filename='"+file.originalname+"'"
                // res.set(aux)
                // console.log(aux)
                // res.send()
                fs.exists(path.resolve(file.path, file.name), (exists) => {
                    if (exists) {

                        res.attachment((file.originalname));
                        return res.status(200).sendFile(file.name, options);
                    } else {
                        try {
                            File.findByIdAndRemove(req.params.fileId, (error) => {
                                return res.status(404).send({
                                    error: "Arquivo Não encontrado"
                                });
                            });
                        } catch (error) {

                        }

                    }
                });
            })
            .catch(erro => {
                console.log(erro);
                return res.status(404).send({
                    error: "Arquivo Não encontrado"
                });
            });
    } catch (e) {
        // statements
        return res.status(404).send({
            error: "Arquivo Não encontrado"
        });
        console.log(e);
    }

    // res.send({ ok: true, fileId: req.params.fileId })
};

exports.upload = async (req, res, next) => {




    async function checkFile(filename, cont) {
        const vetor = await File.find({
            type: checkType(filename).type
        }).select('originalname')
        // console.log(vetor)

        function file_exists(type, types) {
            let i = 0
            while (i < types.length) {
                if (types[i].originalname === type) {
                    return true
                }
                i++
            }
            return false
        }

        function checkFile_aux(filename, cont, vetor) {

            if (file_exists(filename, vetor)) {
                let extention = filename.split(".")[filename.split(".").length - 1];
                let name = filename.substring(0, filename.length - (extention.length + 1))
                // console.log(name)
                // console.log(name.split('_'))
                if (cont === 0) {
                    cont++
                    let finChekc = cont
                    // console.log("fincheck = "+finChekc)

                    let newName = name.substring(0, name.length)
                    // console.log(newName+'_'+cont+'.'+extention)
                    filename = checkFile_aux(newName + '_' + cont + '.' + extention, cont, vetor)

                } else {

                    let finChekc = name.split('_')[name.split('_').length - 1]
                    // console.log("fincheck = "+finChekc)

                    let newName = name.substring(0, name.length - (finChekc.length + 1))
                    cont++
                    // console.log(newName+'_'+cont+'.'+extention)
                    filename = checkFile_aux(newName + '_' + cont + '.' + extention, cont, vetor)
                }
            }

            return filename
            // function getFilename(filename)


        }
        let returnn = await checkFile_aux(filename, cont, vetor)
        // console.log(returnn)
        return returnn

    }









    await upload(req, res, async error => {
        if (error) {
            return res.status(500).send({
                response: {
                    error: error
                }
            });
        }
        // console.log(req.files)
        let responsefiles = [];
        let responseerro = [];
        if (req.files.length === 0) {
            return res.status(428).send({
                error: "Files empty, please try again with files not empty. "
            });
        }
        await Promise.all(
            req.files.map(async mapFile => {
                try {
                    const tmp = await File.create({
                        name: mapFile.filename,
                        originalname: await checkFile(mapFile.originalname, 0),
                        path: mapFile.destination,
                        type: checkType(mapFile.originalname).type,
                        size: mapFile.size
                    });
                    // console.log('try')
                    await tmp.save();
                    responsefiles.push(tmp);
                    // console.log(tmp)
                } catch (e) {
                    try {
                        fs.unlink(mapFile.path);
                    } catch (error) {}
                    responseerro.push({
                        error: e,
                        file: mapFile,
                        create: false
                    });
                    // statements
                    // console.log(e);
                }
            })
        );

        // let files = req.files;
        // console.log(files)
        const response = {
            files: [],
            error: []
        };
        response.files = responsefiles.map(file => {
            // console.log(file.originalname)
            let type = checkType(file.originalname);
            return {
                id: file._id,
                filename: file.originalname,
                filesize: file.size,
                type: type.type,
                create: true
            };
        });
        response.error = responseerro;
        return res.status(202).send(response);
        // console.log(req.file)
    });
};

exports.delete = async (req, res, next) => {
    try {
        File.findById(req.params.fileId)
            .exec()
            .then(async file => {
                if (!file) {
                    return res.status(404).send({
                        error: "File not found"
                    });
                }
                console.log(path.resolve(file.path, file.name));
                try {
                    const che = await File.remove(file);
                    // .then(error =>{
                    // 	console.log(error)
                    // })
                    fs.unlinkSync(path.resolve(file.path, file.name));
                    return res.status(202).send({
                        response: "File Delete Successfull."
                    });
                } catch (e) {
                    return res.status(500).send({
                        error: "Cannot delete file, please try again."
                    });
                }
            })
            .catch(erro => {
                // console.log(erro)
                return res.status(500).send({
                    error: "Cannot delete file, please try again."
                });
            });
    } catch (e) {
        // statements
        return res.status(404).send({
            error: "File not found"
        });
        console.log(e);
    }
    // res.send({ ok: true, fileId: req.params.fileId })
    // console.written('clear')
    // await Promise.all(async (req, res) =>{
    // 	let file = await File.findById(req.params.fileId)

    // 	let check = await File.remove(file)
    // 	fs.unlink(path.resolve(file.path, file.name))
    // 	res.send()

    // }
    // )

    // let file = [await File.findById(req.params.fileId)]
    // await Promise.all( file.map(async file =>{
    // 	await File.findByIdAndRemove(req.params.fileId)
    // 	fs.unlink(path.resolve(file.path, file.name))
    // }))

    // res.send()
};

// module.exports = app => app.use("/files", router);