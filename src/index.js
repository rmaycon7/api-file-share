const express = require('express')

const bodyParser = require('body-parser')

const app = express()

const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

require('./app/controllers/index')(app);


app.use((req, res, next) =>{
	const error = new Error("Not Found!")
	error.status = 404
	next(error)
})


app.use((error, req, res, mext) =>{
	res.status(error.status || 500);
	res.send({
		error: error.status + "!" + error.message
	})
})

// console.

app.listen(3000, error =>{
	// if(error) console.log({erro: error})
	// else 
		console.log('server run port 3000')
})

