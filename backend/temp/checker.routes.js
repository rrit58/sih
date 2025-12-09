const express = require('express')
const router = express.Router()
const controller = require('./checker.controller')

// POST /api/checker - create an entry
router.post('/', controller.createEntry)

// GET /api/checker - list entries (supports ?page=&limit=&status=)
router.get('/', controller.listEntries)

// GET /api/checker/:id - get single entry
router.get('/:id', controller.getEntry)

// PUT /api/checker/:id - update entry
router.put('/:id', controller.updateEntry)

// DELETE /api/checker/:id - delete entry
router.delete('/:id', controller.deleteEntry)

module.exports = router
