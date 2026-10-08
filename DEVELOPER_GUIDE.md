# 🛠️ คู่มือนักพัฒนา (Developer Guide)
**Project:** QM Asset Control Center

เอกสารฉบับนี้จัดทำขึ้นเพื่อนักพัฒนา (Developer) หรือ System Admin ที่จะเข้ามารับช่วงต่อในการดูแล, แก้ไข, หรือ Deploy ระบบ

---

## 🏗️ 1. System Architecture (สถาปัตยกรรมระบบ)
ระบบถูกออกแบบโดยแยกฝั่ง Frontend และ Backend ออกจากกันอย่างชัดเจน (Decoupled Architecture) 

- **Frontend:** พัฒนาด้วย `React` (TypeScript) และสร้าง Build tool ด้วย `Vite`
  - **Styling:** ใช้ `Tailwind CSS` เป็นหลัก
  - **Icons:** ใช้ `lucide-react`
  - **Routing / State:** ปัจจุบันใช้ React State (`activeTab` + URL Hash `#`) ในการสลับหน้า เพื่อให้เป็น Single Page Application แบบเบาๆ (ไม่มี react-router-dom)
- **Backend:** พัฒนาด้วย `Node.js` + `Express` (TypeScript)
  - **Database:** `MySQL` (แบ่งเป็น 2 ก้อนคือ `qm_users_db` และ `qm_assets_db` ตาม Requirement)
  - **Authentication:** ใช้ `JSON Web Token (JWT)` ในการตรวจสอบสิทธิ์
- **Deployment:** รันด้วย `PM2` บน Windows Server

---

## 📁 2. Folder Structure (โครงสร้างโฟลเดอร์)

### ฝั่ง Frontend (Root Directory)
```text
/
├── src/
│   ├── api.ts              # ตัวจัดการ Axios สำหรับยิง Request ไปหา Backend
│   ├── App.tsx             # Component หลัก ควบคุมการสลับหน้า (Tabs) และ Idle Timer
│   ├── main.tsx            # จุด Entry point ของ React
│   ├── components/         # โฟลเดอร์รวม UI Components ทั้งหมด
│   │   ├── common/         # Component ย่อยที่ใช้ซ้ำๆ เช่น Button, Modal, StatusBadge
│   │   ├── masterlist/     # Component ย่อยของหน้า Master List (Table, Card, Filter)
│   │   └── ...             # หน้า View ต่างๆ เช่น DashboardView, RequestView
│   ├── contexts/           # บริหารจัดการ Global State (AuthContext สำหรับเก็บ Session)
│   ├── hooks/              # Custom Hooks (เช่น useIdleTimer)
│   ├── services/           # ฟังก์ชันคำนวณและเชื่อมต่อ API (storage.ts, depreciation.ts)
│   └── types/              # ประกาศ Type/Interface ของ TypeScript (asset.ts)
├── .env                    # ตั้งค่าตัวแปร Frontend (VITE_API_URL, PORT)
└── start-pm2.bat           # สคริปต์สำหรับสตาร์ทระบบบนเซิร์ฟเวอร์
```

### ฝั่ง Backend (`/backend` Directory)
```text
/backend/
├── src/
│   ├── config/             # ตั้งค่า Database Connection (db.ts)
│   ├── controllers/        # ควบคุม Business Logic ทำงานร่วมกับ Request/Response
│   │   ├── authController.ts  # จัดการ Login, Register, JWT
│   │   ├── assetController.ts # จัดการ ดึงข้อมูล, อัปเดต, ลบ Asset และระบบ Import
│   │   └── auditController.ts # จัดการประวัติการแก้ไข (Audit Trail)
│   ├── middleware/         # Middleware เช่น ตรวจสอบ JWT Token, จัดการอัปโหลดไฟล์ (Multer)
│   ├── routes/             # กำหนดเส้นทาง API Endpoint (Express Router)
│   └── server.ts           # Entry point ของ Backend (ตั้งค่า Express, CORS)
└── .env                    # ตั้งค่าพอร์ตและรหัสผ่าน Database
```

---

## 🗄️ 3. Database Schema (โครงสร้างฐานข้อมูล)

### Database: `qm_users_db`
- **Table `users`:** เก็บข้อมูลพนักงาน (employee_id, username, password_hash, location, role_id)
- **Table `roles`:** เก็บสิทธิ์การใช้งาน (1 = Level 1 Owner, 2 = Level 2 Admin)

### Database: `qm_assets_db`
- **Table `assets`:** เก็บข้อมูลสินทรัพย์ทั้งหมด (machineName, assetNo, amountThb, status, reviewStatus ฯลฯ)
- **Table `audit_logs`:** เก็บประวัติการกระทำ (Action) เช่น การเพิ่ม, อนุมัติ, แก้ไข (user_id, action, target_type, details)

---

## 🔌 4. API Endpoints Overview
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/login` | ล็อกอินและรับ JWT Token | No |
| GET | `/api/assets` | ดึงข้อมูลสินทรัพย์ทั้งหมด | Yes |
| POST | `/api/assets` | สร้างคำขอเพิ่มสินทรัพย์ใหม่ | Yes |
| PUT | `/api/assets/:id` | แก้ไขข้อมูลสินทรัพย์ | Yes |
| DELETE| `/api/assets/:id` | ลบสินทรัพย์ | Yes (Admin) |
| POST | `/api/assets/import` | อัปโหลดไฟล์ Excel เพื่อ Import ข้อมูล | Yes (Admin) |
| GET | `/api/audit` | ดึงประวัติการแก้ไข (Audit Trail) ทั้งหมด | Yes |

---

## 🚀 5. การตั้งค่าและการรันระบบ (Setup & Deployment)

### การพัฒนาบนเครื่อง Local (Dev Mode)
1. เปิดไฟล์ `backend/.env` ตั้งค่า `DB_HOST=localhost` และตรวจสอบรหัสผ่าน MySQL
2. เปิดไฟล์ `.env` (ที่ Root) ตั้งค่า `VITE_API_URL=http://localhost:5000/api`
3. รันคำสั่ง `npm run dev:all` (ระบบจะสตาร์ททั้ง Frontend พอร์ต 3000 และ Backend พอร์ต 5000 ให้พร้อมกัน)

### การ Deploy บน Production (Windows Server)
1. **เตรียม Database:** สร้างฐานข้อมูลและรันไฟล์ SQL Schema บนเซิร์ฟเวอร์
2. **Build Code:** รัน `npm run build` ทั้งหน้า Root และในโฟลเดอร์ `/backend`
3. **ตั้งค่า .env:** แก้ไข IP Address ในไฟล์ `.env` ทั้งสองที่ให้ชี้ไปที่ IP ของเซิร์ฟเวอร์ (เช่น `10.50.20.20`)
4. **สตาร์ทระบบด้วย PM2:** 
   - ระบบมีไฟล์ Batch script เตรียมไว้ให้แล้ว
   - ดับเบิ้ลคลิกไฟล์ `start-pm2.bat` เพื่อรัน Backend และ Frontend ทิ้งไว้เป็น Background Process
   - หากต้องการปิดระบบ ให้รันไฟล์ `stop-pm2.bat`

---

## 🧩 6. ฟีเจอร์ที่น่าสนใจในโค้ด (Notable Implementations)
- **Auto-Logout (Idle Timer):** ทำงานอยู่ในไฟล์ `src/hooks/useIdleTimer.ts` ซึ่งจับ Event (mousemove, keydown) หากไม่มีการเคลื่อนไหวเกิน 15 นาที ระบบจะเรียกคำสั่ง `logout()` ทันที
- **Hash Routing:** แทนที่จะใช้ `react-router` ระบบใช้ `window.location.hash` ผูกกับ React State (`activeTab`) ทำให้ URL สามารถ Copy ไปแชร์ได้ (เช่น `/#masterlist`)
- **Book Value Calculation:** การคำนวณค่าเสื่อมราคาจะทำสดๆ (On the fly) ที่ Frontend โดยดึงสูตรจากไฟล์ `src/services/depreciation.ts` โดยไม่ได้เก็บค่าเสื่อมรายวันลง Database เพื่อประหยัดพื้นที่
