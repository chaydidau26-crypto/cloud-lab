const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("../models/Student");

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());

// =========================
// TEST BACKEND
// =========================
app.get("/", (req, res) => {
  res.send("Backend cloud Lab đang hoạt động!");
});

// =========================
// GET DANH SÁCH SINH VIÊN
// =========================
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json(students);
  } catch (error) {
    console.error("Lỗi lấy sinh viên:", error);

    res.status(500).json({
      message: "Không thể lấy danh sách sinh viên",
      error: error.message,
    });
  }
});

// =========================
// POST THÊM SINH VIÊN
// =========================
app.post("/api/students", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    // Kiểm tra dữ liệu
    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    // Kiểm tra MSSV đã tồn tại
    const existingStudent = await Student.findOne({
      studentId: studentId,
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "MSSV đã tồn tại!",
      });
    }

    // Tạo sinh viên mới
    const student = new Student({
      studentId: studentId,
      name: name,
      email: email,
    });

    // Lưu MongoDB
    const savedStudent = await student.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Lỗi thêm sinh viên:", error);

    res.status(500).json({
      message: "Không thể thêm sinh viên",
      error: error.message,
    });
  }
});

// =========================
// KẾT NỐI MONGODB ATLAS
// =========================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// =========================
// PORT
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});