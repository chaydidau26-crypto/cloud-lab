import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  // Sinh viên đang được sửa
  const [editingId, setEditingId] = useState(null);

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
      console.error("Lỗi lấy danh sách:", error);
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
  // THÊM / CẬP NHẬT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId.trim() || !name.trim() || !email.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      let response;

      if (editingId) {
        // CẬP NHẬT
        response = await fetch(
          `${API_URL}/students/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId: studentId.trim(),
              name: name.trim(),
              email: email.trim(),
            }),
          }
        );
      } else {
        // THÊM
        response = await fetch(`${API_URL}/students`, {
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
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Có lỗi xảy ra!"
        );
      }

      if (editingId) {
        alert("Cập nhật sinh viên thành công!");
      } else {
        alert("Thêm sinh viên thành công!");
      }

      // Xóa form
      setStudentId("");
      setName("");
      setEmail("");
      setEditingId(null);

      // Tải lại danh sách
      getStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert(error.message);
    }
  };

  // =========================
  // BẤM NÚT SỬA
  // =========================
  const editStudent = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // HỦY SỬA
  // =========================
  const cancelEdit = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  // =========================
  // XÓA SINH VIÊN
  // =========================
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Không thể xóa sinh viên!"
        );
      }

      alert("Xóa sinh viên thành công!");

      // Tải lại danh sách
      getStudents();
    } catch (error) {
      console.error("Lỗi xóa sinh viên:", error);
      alert(error.message);
    }
  };

  // =========================
  // GIAO DIỆN
  // =========================
  return (
    <div className="container">
      <div className="card">

        <h1>Quản lý sinh viên</h1>

        <h2>
          {editingId
            ? "Cập nhật sinh viên"
            : "Thêm sinh viên"}
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="student-form"
        >
          <input
            type="text"
            placeholder="MSSV"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Họ tên"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button type="submit">
            {editingId
              ? "Cập nhật sinh viên"
              : "Thêm sinh viên"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
            >
              Hủy sửa
            </button>
          )}
        </form>

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
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="empty"
                  >
                    Chưa có sinh viên
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.studentId}</td>

                    <td>{student.name}</td>

                    <td>{student.email}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          editStudent(student)
                        }
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteStudent(student._id)
                        }
                      >
                        Xóa
                      </button>
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