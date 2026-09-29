# QM Asset Control Tracking System (คู่มือการใช้งานและสถาปัตยกรรมระบบ)

เอกสารฉบับนี้จัดทำขึ้นเพื่ออธิบายการทำงาน โครงสร้างระบบ (Architecture) และฟังก์ชันการใช้งานทั้งหมดของระบบ **QM Asset Control Tracking System** สำหรับควบคุมและติดตามสินทรัพย์ของแผนก QM (Quality Management) อย่างละเอียด

---

## 🏗 โครงสร้างสถาปัตยกรรมระบบ (System Architecture)

ระบบถูกออกแบบในสถาปัตยกรรม **Client-Server** โดยแบ่งการทำงานออกเป็น 2 ส่วนหลัก ได้แก่

### 1. Frontend (User Interface)
* **Framework:** React.js (TypeScript) + Vite
* **Styling:** Tailwind CSS (ออกแบบ UI ในสไตล์ Precision Industrial Control)
* **State & Routing:** บริหารจัดการ State ภายใน Components และ Context API (สำหรับการยืนยันตัวตน - Auth)
* **Features:** 
  * กราฟและสถิติ (Recharts)
  * การคำนวณค่าเสื่อมราคาสินทรัพย์ (Depreciation) ภายในเบราว์เซอร์
  * รองรับการแสดงผลทั้งแบบตาราง (Table View) และแบบการ์ด (Card View)

### 2. Backend (RESTful API & Database)
* **Runtime:** Node.js (Express.js) + TypeScript
* **Database:** MySQL (`qm_assets_db` สำหรับข้อมูลสินทรัพย์, `qm_users_db` สำหรับข้อมูลผู้ใช้)
* **Security:** JWT (JSON Web Token) Authentication และ Middleware ป้องกันการเข้าถึง API
* **File Processing:** ใช้ `exceljs` และ `csv-parse` สำหรับสร้างและอ่านไฟล์ Excel/CSV ขาเข้า-ออก

---

## ⚙️ ฟังก์ชันและโมดูลการทำงานหลัก (Core Features)

### 1. ระบบยืนยันตัวตนและการจัดการสิทธิ์ (Authentication & Role-Based Access)
ระบบแบ่งสิทธิ์การใช้งานออกเป็น 2 ระดับหลัก:
- **Level 2 Admin (Authorized CAL Team / QM Admin):** สามารถมองเห็น แก้ไข ลบ และอนุมัติ (Approve) สินทรัพย์ได้ **ทุกรายการ** ในระบบ รวมถึงจัดการบัญชีผู้ใช้งานได้
- **Level 1 Owner (General Users):** สามารถดูข้อมูลภาพรวมได้ แต่จะ **แก้ไขข้อมูลได้เฉพาะสินทรัพย์ที่ตนเองเป็นเจ้าของ (Owner) เท่านั้น**

### 2. Dashboard (Executive Telemetry)
หน้าจอสรุปภาพรวมสินทรัพย์ทั้งหมดในระบบ:
- **KPI Cards:** สรุปจำนวนสินทรัพย์ทั้งหมด, ต้นทุนรวม (Purchase Cost), มูลค่าทางบัญชีปัจจุบัน (Current Book Value)
- **Useful Life Alert:** ระบบแจ้งเตือนสินทรัพย์ที่มีอายุการใช้งานครบ หรือเกินเกณฑ์มาตรฐาน 7 ปี (7-Yr Rule) เพื่อใช้วางแผนงบประมาณ (Replacement Budget Planning)
- **Visual Charts:** 
  - กราฟวงกลมแสดงสัดส่วนประเภทเครื่องจักร (Machine Type)
  - กราฟวงกลมแสดงสภาพและสถานะการทำงาน (Operational Health)
  - กราฟแท่งแสดงช่วงอายุการใช้งานของสินทรัพย์ (Age Distribution)

### 3. Master List (บัญชีสินทรัพย์หลัก)
ศูนย์กลางในการจัดการข้อมูลสินทรัพย์ที่ผ่านการอนุมัติแล้ว (Active):
- **Search & Filter:** ค้นหาด้วยคีย์เวิร์ด และกรองตาม ประเภทเครื่องจักร, สถานะ, โรงงาน (Plant)
- **Import / Export (Backend-Driven):** 
  - **Export:** ดาวน์โหลดข้อมูลสินทรัพย์ทั้งหมดออกมาในรูปแบบไฟล์ `.xlsx` (Template มาตรฐาน 24 คอลัมน์)
  - **Import:** นำเข้าข้อมูลจำนวนมากผ่านไฟล์ `.xlsx` หรือ `.csv` โดยระบบจะทำการ Upsert (อัปเดตข้อมูลเดิมหากพบ Asset No. ตรงกัน หรือเพิ่มข้อมูลใหม่หากไม่พบ)
- **Action Buttons:** 
  - **Calc:** คำนวณค่าเสื่อมราคาและมูลค่าทางบัญชี (Depreciation) ตามเกณฑ์ 7 ปี
  - **History:** ดูประวัติการเปลี่ยนแปลง (Audit Trail) ของสินทรัพย์นั้นๆ
  - **Edit:** แก้ไขรายละเอียด (สงวนสิทธิ์เฉพาะ Admin หรือ Owner ของสินทรัพย์)

### 4. Waiting List Review (ระบบทบทวนและอนุมัติ)
หน้าต่างสำหรับทีม CAL (Level 2 Admin) เพื่อใช้กรองและตรวจสอบสินทรัพย์ใหม่:
- สินทรัพย์ที่ถูกสร้างใหม่ ทั้งจากการเพิ่ม Manual หรือจากระบบ External (QM PM Web, Hana Equipment Online, Machine Buy-off) จะถูกตั้งสถานะเป็น **Waiting List** เสมอ
- ทีม CAL จะต้องเข้ามาตรวจสอบความถูกต้อง และระบุ **มูลค่าทางบัญชี (Book Value THB)**
- เมื่อกด **Approve** ข้อมูลจะถูกเปลี่ยนสถานะเป็น **Active** และปรากฏใน Master List โดยอัตโนมัติ

### 5. Audit Trail (ประวัติการดำเนินการ)
ระบบบันทึกความเคลื่อนไหว (Log) ที่เกิดขึ้นกับสินทรัพย์ทุกรายการโดยละเอียด:
- บันทึกเหตุการณ์ (Action): CREATED, UPDATED, APPROVED, STATUS_CHANGED
- บันทึกผู้ทำรายการ, บทบาท (Role), และเวลาที่เกิดเหตุการณ์
- แสดงรายละเอียดฟิลด์ที่ถูกเปลี่ยนแปลง (เช่น เปลี่ยนสถานะจาก Good เป็น Fair)

---

## 🔄 ลำดับขั้นตอนการทำงาน (Workflow)

### Workflow การเพิ่มและอนุมัติสินทรัพย์ใหม่
1. **[User]** กดปุ่ม "Add New Asset" จากหน้าแรก (หรือระบบดึงข้อมูลจาก Web ภายนอก)
2. **[System]** ระบบจะบันทึกข้อมูลเบื้องต้นลงฐานข้อมูล และตั้งค่าสถานะเป็น `reviewStatus = 'Waiting List'`
3. **[CAL Admin]** ล็อกอินเข้าสู่ระบบ และไปที่แท็บ **Waiting Review**
4. **[CAL Admin]** ตรวจสอบรายการสินทรัพย์ และกดปุ่ม **Approve**
5. **[System]** ระบบจะบังคับให้ Admin ระบุตัวเลข **Book Value** (มีระบบคำนวณตัวเลขแนะนำให้เบื้องต้น)
6. **[System]** เมื่อกดยืนยัน ระบบจะทำคำสั่ง UPDATE ข้อมูลไปยังฐานข้อมูล เปลี่ยน `reviewStatus` เป็น `'Active'`
7. **[System]** บันทึกประวัติการทำรายการลงใน Audit Trail
8. **[System]** สินทรัพย์ดังกล่าวจะแสดงผลบนหน้า Dashboard และ Master List ทันที

### Workflow การ Import ข้อมูลผ่าน Excel
1. **[User]** กดปุ่ม "Download Template" จากหน้า Master List
2. **[System]** Backend สร้างไฟล์ Excel แบบ Real-time ตามคอลัมน์มาตรฐาน 24 ฟิลด์ ส่งให้ผู้ใช้ดาวน์โหลด
3. **[User]** กรอกข้อมูลหรือคัดลอกข้อมูลเก่าลงใน Template 
4. **[User]** กดอัปโหลดไฟล์ในระบบผ่านปุ่ม "Import Excel/CSV"
5. **[Backend]** รับไฟล์ขึ้น Memory -> ตรวจสอบนามสกุล -> แยกวิเคราะห์ข้อมูล
6. **[Backend]** ลูปอ่านข้อมูลทีละแถว:
   - ตรวจสอบ `Asset No.` ในฐานข้อมูล
   - **ถ้ามี:** ทำการคำสั่ง `UPDATE` ฟิลด์ต่างๆ (คงสถานะ `itemNo` เดิมไว้)
   - **ถ้าไม่มี:** ทำการคำสั่ง `INSERT` ข้อมูลใหม่ (ดึง Username ผู้ที่กำลังทำรายการไปใส่ในฟิลด์ `Owner` ให้อัตโนมัติ)
7. **[System]** โหลดข้อมูลในตารางใหม่ทั้งหมดบนหน้าเว็บ

---

## 🛠 ข้อมูลทางเทคนิคและฐานข้อมูล (Technical Details)

### โครงสร้างตารางฐานข้อมูลหลัก (Assets Table)
| ฟิลด์ (Column) | ชนิดข้อมูล (Type) | คำอธิบาย (Description) |
| :--- | :--- | :--- |
| `id` | VARCHAR(50) (PK) | รหัส Primary Key ของระบบ (สร้างด้วย `ast-timestamp`) |
| `itemNo` | INT (Auto Increment) | หมายเลขลำดับอัตโนมัติของฐานข้อมูล |
| `assetNo` | VARCHAR(100) | รหัสสินทรัพย์อ้างอิง |
| `machineName` | VARCHAR(255) | ชื่อเครื่องจักร/อุปกรณ์ |
| `receivedDate` | DATE | วันที่รับเข้า (ระบบจะคำนวณอายุอัตโนมัติจากฟิลด์นี้) |
| `invCost` | DECIMAL(15,2) | ราคาซื้อดั้งเดิม |
| `bookValueThb`| DECIMAL(15,2) | มูลค่าทางบัญชีปัจจุบัน |
| `reviewStatus`| VARCHAR(50) | สถานะการรีวิว (`Waiting List` หรือ `Active`) |

### การดักจับข้อผิดพลาด (Error Handlings ที่ถูกติดตั้งไว้)
- **Safe Database Parsing:** หากส่งค่า `receivedDate` เป็นค่าว่าง (`""`) ระบบ Backend จะกรองและแปลงเป็น `null` อัตโนมัติ เพื่อป้องกัน MySQL Strict Mode Error
- **Safe Frontend Filtering:** คอลัมน์ที่รองรับการค้นหา (เช่น Brand, Model) หากมีค่าเป็น `null` ระบบจะมองเป็นค่าว่าง (`''`) แทนการสั่ง `.toLowerCase()` ตรงๆ ป้องกันหน้าเว็บ Crash

---
*เอกสารสร้างเมื่อ: ตุลาคม 2024*
*ดูแลระบบโดย: QM Asset Control Center Team*
