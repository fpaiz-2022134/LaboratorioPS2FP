'use strict'

import express from 'express'


import {
    test,
    registerEst,
    getCourses,
    updateEst,
    login,
    deleteEst
} from './student.controller.js'

const api = express.Router()

api.get('/test', test)
api.post('/registerEst', registerEst)
api.get('/getCourses', getCourses)
api.put('/updateEst/:id', updateEst)
api.post('/login', login),
api.delete('/deleteEst/:token', deleteEst)
export default api