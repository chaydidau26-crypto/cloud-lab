
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
  res.status(200).send("Backend cloud Lab đang hoạt động!");
});

// =========================
// KIỂM TRA MONGODB
// =========================
app.get("/api/health", (req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    server: "OK",
    mongodb: states[mongoose.connection.readyState],
    readyState: mongoose.connection.readyState,
  });
});

// =========================
// GET DANH SÁCH SINH VIÊN
// =========================
app.get("/api/students", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "MongoDB chưa kết nối!",
        mongodbState: mongoose.connection.readyState,
      });
    }

    const students = await Student.find().sort({ createdAt: -1 });

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
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "MongoDB chưa kết nối!",
        mongodbState: mongoose.connection.readyState,
      });
    }

    const { studentId, name, email } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    const existingStudent = await Student.findOne({
      studentId: studentId,
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "MSSV đã tồn tại!",
      });
    }

    const student = new Student({
      studentId: studentId,
      name: name,
      email: email,
    });

    const savedStudent = await student.save();

    res.status(201).json({
      message: "Thêm sinh viên thành công!",
      student: savedStudent,
    });
  } catch (error) {
    console.error("Lỗi thêm sinh viên:", error);

    res.status(500).json({
      message: "Không thể thêm sinh viên",
      error: error.message,
    });
  }
});

// =========================
// PUT CẬP NHẬT SINH VIÊN
// =========================
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, name, email } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      {
        studentId: studentId,
        name: name,
        email: email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên!",
      });
    }

    res.status(200).json({
      message: "Cập nhật sinh viên thành công!",
      student: student,
    });
  } catch (error) {
    console.error("Lỗi cập nhật sinh viên:", error);

    res.status(500).json({
      message: "Không thể cập nhật sinh viên",
      error: error.message,
    });
  }
});

// =========================
// DELETE XÓA SINH VIÊN
// =========================
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên!",
      });
    }

    res.status(200).json({
      message: "Xóa sinh viên thành công!",
      student: student,
    });
  } catch (error) {
    console.error("Lỗi xóa sinh viên:", error);

    res.status(500).json({
      message: "Không thể xóa sinh viên",
      error: error.message,
    });
  }
});

// =========================
// KẾT NỐI MONGODB ATLAS
// =========================
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Không tìm thấy MONGODB_URI trong file .env");
    }

    console.log("Đang kết nối MongoDB Atlas...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected successfully!");
    console.log("MongoDB readyState:", mongoose.connection.readyState);
    console.log("Database:", mongoose.connection.name);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:");
    console.error(error.message);

    process.exit(1);
  }
}

// =========================
// KHỞI ĐỘNG SERVER
// =========================
startServer();
