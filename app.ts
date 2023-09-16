import express, { Request, Response } from 'express';
import mysql from 'mysql';

const app = express();

app.use(express.json()); // Cho phép đọc JSON từ yêu cầu
app.use(express.urlencoded({ extended: true })); // Cho phép đọc dữ liệu gửi dưới dạng form-urlencoded


// Kết nối đến cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Thay bằng tên người dùng của bạn
  password: 'pkh7822', // Thay bằng mật khẩu của bạn
  database: 'test', // Thay bằng tên cơ sở dữ liệu của bạn
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối đến MySQL: ', err);
  } else {
    console.log('Kết nối thành công đến MySQL');
  }
});

// Middleware để xử lý JSON
app.use(express.json());

// Tạo một route để lấy dữ liệu từ MySQL
app.get('/api/data', (req: Request, res: Response) => {
  const query = 'SELECT * FROM LoaiHang'; // Thay bằng tên bảng của bạn
  db.query(query, (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn MySQL: ', err);
      res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
    } else {
      res.json(result);
    }
  });
});

app.post('/api/data', (req: Request, res: Response) => {
  const { id, TenLH } = req.body;
  
  const query = 'INSERT INTO loaihang (LoaiHangID, TenLH) VALUES (?,?)';
  db.query(query, [id,TenLH], (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn MySQL: ', err);
      res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
    } else {
      res.json({ message: 'Dữ liệu đã được thêm thành công' });
    }
  });
});


// API để sửa một hàng theo LoaiHangID
app.put('/api/data/:LoaiHangID', (req: Request, res: Response) => {
  const { LoaiHangID } = req.params;
  const { TenLH } = req.body;
  
  const query = 'UPDATE loaihang SET TenLH = ? WHERE LoaiHangID = ?';
  
  db.query(query, [TenLH, LoaiHangID], (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn MySQL: ', err);
      res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
    } else {
      res.json({ message: 'Dữ liệu đã được sửa đổi thành công' });
    }
  });
});

// API để xóa một hàng theo LoaiHangID
app.delete('/api/data/:LoaiHangID', (req: Request, res: Response) => {
  const { LoaiHangID } = req.params;
  
  const query = 'DELETE FROM loaihang WHERE LoaiHangID = ?';
  db.query(query, [LoaiHangID], (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn MySQL: ', err);
      res.status(500).json({ error: 'Lỗi truy vấn MySQL' });
    } else {
      res.json({ message: 'Dữ liệu đã được xóa thành công' });
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang lắng nghe trên cổng ${PORT}`);
});
