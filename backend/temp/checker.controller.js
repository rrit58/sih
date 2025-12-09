const Checker = require('./checker.model')

async function createEntry(req, res) {
  try {
    const { name, phone, email, district, panchayat, description, attachments } = req.body
    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description are required' })
    }

    const entry = new Checker({ name, phone, email, district, panchayat, description, attachments })
    await entry.save()
    return res.status(201).json({ success: true, data: entry })
  } catch (err) {
    console.error('createEntry error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

async function listEntries(req, res) {
  try {
    const { page = 1, limit = 20, status } = req.query
    const filter = {}
    if (status) filter.status = status

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit)
    const entries = await Checker.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
    const total = await Checker.countDocuments(filter)
    return res.json({ success: true, data: entries, meta: { total, page: parseInt(page), limit: parseInt(limit) } })
  } catch (err) {
    console.error('listEntries error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

async function getEntry(req, res) {
  try {
    const { id } = req.params
    const entry = await Checker.findById(id)
    if (!entry) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: entry })
  } catch (err) {
    console.error('getEntry error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

async function updateEntry(req, res) {
  try {
    const { id } = req.params
    const updates = req.body
    updates.updatedAt = Date.now()
    const entry = await Checker.findByIdAndUpdate(id, updates, { new: true })
    if (!entry) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, data: entry })
  } catch (err) {
    console.error('updateEntry error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

async function deleteEntry(req, res) {
  try {
    const { id } = req.params
    const entry = await Checker.findByIdAndDelete(id)
    if (!entry) return res.status(404).json({ success: false, message: 'Not found' })
    return res.json({ success: true, message: 'Deleted' })
  } catch (err) {
    console.error('deleteEntry error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

module.exports = { createEntry, listEntries, getEntry, updateEntry, deleteEntry }
