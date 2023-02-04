const mongoose = require('mongoose')
const slugify = require('slugify')
// const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'A Tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A Tour name must have less or equal then 40 characters'],
        minlength: [10, 'A Tour name must have more or equal then 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must inly contains characters']
    },
    slug: String,
    duration: {
        type: Number,
        require: [true, 'A Tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        require: [true, 'A Tour must have a Group size']
    },
    difficulty: {
        type: String,
        require: [true, 'A Tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        require: [true, 'A Tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // this only points current doc on NEW document creation
                return val < this.price
            },
            message: 'Discount price ({VALUE}) should be below regilar price'
        }
    },
    summary: {
        type: String,
        trim: true,
        require: [true, 'A Tour must have a summary']
    },
    description: {
        type: String,
        require: [true, 'A Tour must have a Description']
    },
    imageCover: {
        type: String,
        require: [true, 'A Tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})

// Document middleware: runs before .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// tourSchema.pre('save', function (next) {
//     console.log('Will save document...')
//     next()
// })

// tourSchema.post('save', function(doc, next) {
//     console.log(doc)
//     next()
// })

// Query middleware
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now()
    next()
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} Milliseconds`)
    // console.log(docs)
    next()
})

// Aggregation middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    console.log(this.pipeline())
    next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour