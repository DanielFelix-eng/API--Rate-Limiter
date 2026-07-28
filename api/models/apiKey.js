import mongoose from 'mongoose'

const apiKeySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'default'
  },
  keyHash: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    default: 20
  },
  refillRate: {
    type: Number,
    default: 5
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const ApiKey = mongoose.models.ApiKey || mongoose.model('ApiKey', apiKeySchema)

export default ApiKey