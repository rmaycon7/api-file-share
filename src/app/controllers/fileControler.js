const express = require('express')

const multer = require('multer')

const fs = require('fs')

const path = require('path')

let upload = multer({ dest: 'uploads/' }).array('files',200)

// console.log(upload.dest);

const router = express.Router()

const File = require('../models/File')


function checkType(file) {
    let posi = file.length - file.split('.')[file.split('.').length - 1].length
    // console.log(file.slice(file.split('.')[file.split('.').length - 1], posi - 1))
    // console.log(file.split('.').length);
    // console.log(file.split('.')[file.split('.').length - 1])
    let extention = file.split('.')[file.split('.').length - 1]
    // console.log(extention)
    let docs = ['txt', 'doc', 'docx', 'pdf', 'pptx', 'odt', 'fodt', 'ott', 'out', 'xls', 'srt', 'html', 'htm', 'php', 'js', 'rb', , 'py', 'c', , 'cpp']
    let images = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'ico', 'xdm', 'bitmap', 'bmp', 'xpm', 'psd', 'jpe', 'pgm', 'pnm', 'svg']
    let videos = ['mp4', 'mkv', '3gp', 'mov', 'avi', 'wmv', '3g2', 'flv', 'rm', 'mpg', 'vob', 'rmvb', 'webm']
    let comprimidos = ['zip', '7z', 'tar', 'xz', 'gz', 'rar', 'bin', 'iso']
    let musicas = ['mp3', 'acc', 'm4a', 'wav', 'wma', 'alac', 'flac']

    if (runc(docs, extention)) {
        return { type: 'doc' }
    }
    else if (runc(images, extention)) {
       return { type: 'image' }
    }
    else if (runc(videos, extention)) {
       return { type: 'video' }
    }
    else if (runc(comprimidos, extention)) {
       return { type: 'compress' }
    }
    else if (runc(musicas, extention)) {
       return { type: 'music' }
    }
    else {
        return { type: 'other' }
    }

	function runc(types, type) {
	    let i = 0
	    while (i < types.length) {
	        if (types[i] === type) {
	            return true
	        }
	        i++
	    }
	    return false
	}
}



router.get('/list', async (req, res, next) =>{
	try {
		File.find()
		.sort({type: 1})
		.then(files =>{
			// files.sort()
			const response = files.map(file =>{
				return{
					id: file._id,
					filename: file.originalname,
					filesize: file.size,
					type: file.type,
				}
			})
			return res.status(200).send({
				response: response
			})
		})
	} catch(e) {
		// statements
		return res.status(500).send({
			error: e
		})
		// console.log(e);
	}
})

router.get('/list/:nameType', async (req, res, next) =>{
	try {
		let type = req.params.nameType;
		type.toLowerCase()
		File.findOne({type: type.toLowerCase() })
		.sort({type: 1})
		.then(files =>{
			const response = files.map(file =>{
				return{
					id: file._id,
					filename: file.originalname,
					filesize: file.size,
					type: file.type,
				}
			})
			if(response.length ===0){
				return res.status(404).send({
					error: "Type not found!"
				})
			}
			return res.status(200).send({
				response: response
			})
		})
		.catch(erro =>{
			return res.status(404).send({
				error: "Type not found!"
			})
		})
	} catch(e) {
		// statements
		return res.status(500).send({
			error: e
		})
		// console.log(e);
	}

	// res.send({ ok: true , nameType: req.params.nameType})
})

router.get('/download/:fileId', async (req, res, next) =>{

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
		File.findById(req.params.fileId)
		.exec()
		.then(file =>{
			let options = {
				root: file.path,
				dotfiles: 'deny',
				headers: {
					'x-timestamp': Date.now(),
					'x-sent': true,
					'filename': file.originalname
				},
				acceptRanges: true
			}
			// let aux = "Content-Disposition: attachment; filename='"+file.originalname+"'"
			// res.set(aux)
			// console.log(aux)
			// res.send()
			res.attachment(file.originalname);
			return res.status(200).sendFile(file.name, options)
		})
		.catch(erro => {
			console.log(erro)
			return res.status(404).send({
				error: "Arquivo Não encontrado"
			})
		})

	} catch(e) {
		// statements
		return res.status(404).send({
			error: "Arquivo Não encontrado"
		})
		console.log(e);
	}

	// res.send({ ok: true, fileId: req.params.fileId })
})

router.post('/upload',  async (req, res, next) => {
	await upload(req, res, async (error) =>{
		if(error){
			return res.status(500).send({
				response: {
					error: error
				}
			})
		}
		// console.log(req.files)
		let responsefiles = []
		let responseerro = []
		await Promise.all (req.files.map(async  mapFile => {
			try {
				const tmp = await File.create({ name: mapFile.filename, originalname: mapFile.originalname, path: mapFile.destination , type: checkType(mapFile.originalname).type, size: mapFile.size })
				await tmp.save()
				responsefiles.push(tmp)
				// console.log(tmp)
			} catch(e) {
				fs.unlink(mapFile.path)
				responseerro.push({error: e, file: mapFile, create: false })
				// statements
				// console.log(e);
			}

		}))

		// let files = req.files;
		// console.log(files)
		const response = {files: [], error: []}
		response.files = responsefiles.map((file) => {
			// console.log(file.originalname)
			let type = checkType(file.originalname)
			return {
				id: file._id,
				filename: file.originalname,
				filesize: file.size,
				type: type.type,
				create: true
			}
		})
		response.error = responseerro
		return res.status(202).send({ response })
		// console.log(req.file)

	})
})

router.delete('/delete/:fileId', async (req, res, next) =>{
	try {
		File.findById(req.params.fileId)
		.exec()
		.then( async file =>{
			if(!file ){
				return res.status(404).send({
					error: "File not found"
				})
			}
			console.log(path.resolve(file.path,file.name))
			try {
				const che = await File.remove(file)
				// .then(error =>{
				// 	console.log(error)
				// })
					fs.unlink(path.resolve(file.path,file.name))
					return res.status(202).send({
						response: "File Delete Successfull."
					})

			} catch(e) {
				return res.status(500).send({
					error: "Cannot delete file, please try again."
				})
			}
		})
		.catch(erro => {
			// console.log(erro)
			return res.status(500).send({
				error: "Cannot delete file, please try again."
			})
		})

	} catch(e) {
		// statements
		return res.status(404).send({
			error: "File not found"
		})
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
})

module.exports = app => app.use('/files', router)

