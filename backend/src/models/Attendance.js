// backend/src/models/Attendance.js
const mongoose = require('mongoose');

const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: () => startOfDay(new Date()) },
  clockIn: { type: Date },
  clockOut: { type: Date },
  totalHours: { type: Number, default: 0 }, // ex: 7.5
  status: { type: String, enum: ['Present', 'Absent', 'Remote'], default: 'Present' },
}, { timestamps: true });

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
