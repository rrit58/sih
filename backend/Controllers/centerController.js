// controllers/centerController.js
import Center from '../models/Center.js'

// GET /api/centers
// Supports:
//  - q          → text search (address / district / state / name / pincode)
//  - pincode    → exact pincode search
export const getCenters = async (req, res) => {
  try {
    let { q, pincode } = req.query

    const query = {}

    // If pincode query param present → exact filter
    if (pincode) {
      query.pincode = pincode
    }

    // If q (search text) present → search multiple fields
    if (q) {
      const regex = new RegExp(q, 'i')
      query.$or = [
        { name: regex },
        { address: regex },
        { district: regex },
        { state: regex },
        { pincode: regex },
      ]
    }

    // If q is only 6 digits and no pincode param → treat as pincode search
    if (!pincode && q && /^\d{6}$/.test(q)) {
      query.pincode = q
      delete query.$or
    }

    const centers = await Center.find(query).lean()

    res.json({ success: true, data: centers })
  } catch (err) {
    console.error('[getCenters] Error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// POST /api/centers  (optional, for adding centres manually)
export const createCenter = async (req, res) => {
  try {
    const center = await Center.create(req.body)
    res.status(201).json({ success: true, data: center })
  } catch (err) {
    console.error('[createCenter] Error:', err)
    res.status(400).json({ success: false, message: err.message })
  }
}
