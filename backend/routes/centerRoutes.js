// routes/centerRoutes.js
import express from 'express'
import { getCenters, createCenter } from '../controllers/centerController.js'

const router = express.Router()

router.get('/', getCenters)
router.post('/', createCenter)

export default router