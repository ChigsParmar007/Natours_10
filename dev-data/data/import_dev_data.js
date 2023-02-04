const fs = require('fs')
const mongoose = require('mongoose')
const Tour = require('../../models/tourModel')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.set('strictQuery', false)

mongoose.connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => {
    console.log('Mongodb atlas connected...')
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Data Successfully loaded')
    }
    catch (err) {
        console.log(err)
    }
    process.exit()
}

const deleteData = async () =>  {
    try {
        await Tour.deleteMany()
        console.log('Data Successfully Deleted')
    }
    catch (err) {
        console.log(err)
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData()
}
else if (process.argv[2] === '--delete') {
    deleteData()
}