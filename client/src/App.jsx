import { useEffect, useState } from "react";
import "./App.css";

// Backend API
const API_URL = "/api";

function App() {
  // =========================
  // STATE
  // =========================
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // LẤY DANH SÁCH SINH VIÊN
  // =========================
  const getStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/students`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách sinh viên:", error);
      alert("Không thể kết nối Backend!");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CHẠY KHI MỞ TRANG
  // =========================
  useEffect(() => {
    getStudents();
  }, []);

  // =========================
  // THÊM SINH VIÊN
  // =========================
  const addStudent = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu
    if (!studentId.trim() || !name.trim() || !email.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          studentId: studentId.trim(),
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      // Backend trả lỗi
      if (!response.ok) {
        throw new Error(data.message || "Không thể thêm sinh viên");
      }

      console.log("Sinh viên đã thêm:", data);

      alert("Thêm sinh viên thành công!");

      // Xóa form
      setStudentId("");
      setName("");
      setEmail("");

      // Load lại danh sách
      getStudents();
    } catch (error) {
      console.error("Lỗi thêm sinh viên:", error);

      alert(`Không thể thêm sinh viên!\n${error.message}`);
    }
  };

  // =========================
  // GIAO DIỆN
  // =========================
  return (
    <div className="container">
      <div className="card">

        {/* =========================
            TIÊU ĐỀ
        ========================= */}
        <h1>Quản lý sinh viên</h1>

        {/* =========================
            FORM THÊM SINH VIÊN
        ========================= */}
        <h2>Thêm sinh viên</h2>

        <form
          onSubmit={addStudent}
          className="student-form"
        >
          {/* MSSV */}
          <input
            type="text"
            placeholder="MSSV"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          {/* HỌ TÊN */}
          <input
            type="text"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* BUTTON */}
          <button type="submit">
            Thêm sinh viên
          </button>
        </form>

        {/* =========================
            DANH SÁCH SINH VIÊN
        ========================= */}
        <h2>Danh sách sinh viên</h2>

        {loading ? (
          <p>Đang tải danh sách sinh viên...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ tên</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="empty"
                  >
                    Chưa có sinh viên
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={
                      student._id ||
                      student.studentId
                    }
                  >
                    <td>
                      {student.studentId}
                    </td>

                    <td>
                      {student.name}
                    </td>

                    <td>
                      {student.email}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

export default App;