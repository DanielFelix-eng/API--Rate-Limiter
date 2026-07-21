import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

export const connectedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log(`Connected to Mongo DB :${conn.connection.host}`)
  } catch (error) {
    console.log('Error connecting to mongo db', error.message)
  }
}
 