const AppError = require('../utils/appError')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

const getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(element => {
        if (allowedFields.includes(element)) newObj[element] = obj[element]
    })
    return newObj
}

const updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user post password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update. use updatePassword', 400))
    }

    // 2) Filtered out unwanted fields names that are not allowed to be allowed
    const filteredBody = filterObj(req.body, 'name', 'email')

    // 3) Update user Document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true })

    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    })
})

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    })
})

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
}