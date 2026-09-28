---
name: Precision Industrial Control
project: Frontend UI Design (projects/16384478957627917748)
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4850'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#0051d5'
  on-tertiary: '#ffffff'
  tertiary-container: '#316bf3'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

# Precision Industrial Control — Design System Specification

> สกัดข้อมูลจาก Stitch Project: **Frontend UI Design** (`projects/16384478957627917748`)  
> วันที่สกัด: 28 กันยายน 2026

---

## 1. Brand & Aesthetic Overview

ระบบดีไซน์นี้ได้รับการออกแบบสำหรับระบบควบคุมและติดตามอุปกรณ์อุตสาหกรรมความแม่นยำสูง (Precision Industrial Telemetry & Control System) 
ผสานระหว่าง **Corporate Modern Enterprise** และ **Cleanroom Telemetry Interface** ที่เน้นความชัดเจนในการอ่านข้อมูล ความรวดเร็วในการรับรู้สถานะ และลดความล้าของสายตาในการทำงานต่อเนื่อง

- **ธีมหลัก:** Precision Industrial Control (Light Mode)
- **สไตล์:** Functional, High-Density, Low Visual Noise
- **ฟอนต์หลัก:** IBM Plex Sans (ความคมชัดทางเรขาคณิต แยกตัวอักษร 1, I, l, 0, O ได้ชัดเจน)
- **ฟอนต์ข้อมูลสถิติ/ตัวเลข:** JetBrains Mono (ตัวเลข Tabular Figures เพื่อให้ค่าตัวเลขตรงแนวกันเสมอ)

---

## 2. Color Palette (จานสี)

### 2.1 Core Brand & Interactive Tokens

| Token Name | Hex Code | คำอธิบายและการใช้งาน |
| :--- | :--- | :--- |
| `primary` | `#006194` | สีหลักสำหรับโครงสร้างและการกระทำหลัก (Primary Action) |
| `primary-container` | `#007bb9` | กล่องคอนเทนเนอร์สถานะ active หรือเน้นสำคัญ |
| `on-primary` | `#ffffff` | ข้อความบนสี Primary |
| `on-primary-container` | `#fdfcff` | ข้อความบนสี Primary Container |
| `inverse-primary` | `#93ccff` | สี Primary สำหรับโหมดกลับด้าน |
| `secondary` | `#545f73` | สีรองสำหรับปุ่มเสริม ข้อมูลชั้นรอง |
| `secondary-container` | `#d5e0f8` | พื้นหลังของกลุ่มคอนเทนต์รอง |
| `on-secondary` | `#ffffff` | ข้อความบนสี Secondary |
| `on-secondary-container` | `#586377` | ข้อความบนสี Secondary Container |
| `tertiary` | `#0051d5` | สีน้ำเงินเข้มสำหรับเน้นฟังก์ชันเสริมหรือไฮไลต์ |
| `tertiary-container` | `#316bf3` | คอนเทนเนอร์สำหรับฟังก์ชัน Tertiary |
| `on-tertiary` | `#ffffff` | ข้อความบนสี Tertiary |
| `on-tertiary-container` | `#fefcff` | ข้อความบนสี Tertiary Container |
| `accent / custom-color` | `#0284c7` | Sky/Cyan 600 สำหรับ Interactive Elements, Hover, Filter States |

### 2.2 Functional Industrial Telemetry (สถานะเครื่องจักรและอุปกรณ์)

| สถานะ (Status) | Text/Accent Hex | Background Wash | Border Hex | ตัวอย่างการใช้งาน |
| :--- | :--- | :--- | :--- | :--- |
| **Optimal / Certified** | `#059669` (Emerald 600) | `#ECFDF5` | `#A7F3D0` | เครื่องจักรปกติ, ผ่านการรับรอง |
| **Calibration Due / Warning** | `#D97706` (Amber 600) | `#FFFBEB` | `#FDE68A` | ถึงรอบ Calibrate, แจ้งเตือนเฝ้าระวัง |
| **Critical Fault / Out of Spec** | `#E11D48` (Rose 600) | `#FFF1F2` | `#FECDD3` | เครื่องหยุดทำงาน, ค่าหลุดเกณฑ์พิกัด |
| **Metrology / Lab Hold** | `#7C3AED` (Violet 600) | `#F5F3FF` | `#DDD6FE` | อยู่ระหว่างตรวจสอบในห้อง Lab, Calibration Hold |

### 2.3 Surfaces, Canvas & Backgrounds

| Token Name | Hex Code | การใช้งาน |
| :--- | :--- | :--- |
| `background` / `surface` | `#f8f9ff` | พื้นหลังของหน้าต่างจอหลัก (Canvas) ลดแสงจ้า |
| `surface-container-lowest` | `#ffffff` | พื้นหลังของ Card, Data Table, Modal Layer |
| `surface-container-low` | `#eff4ff` | พื้นหลังระดับตื้นสำหรับกลุ่มข้อมูลย่อย |
| `surface-container` | `#e5eeff` | แถบเครื่องมือ แผงควบคุมรอง |
| `surface-container-high` | `#dce9ff` | ส่วนหัวตาราง หรือ Segment ที่ต้องการความชัดเจน |
| `surface-container-highest` | `#d3e4fe` | สถานะ Hover/Focus บนแถบควบคุม |
| `on-surface` | `#0b1c30` | สีตัวอักษรหลัก (Slate Navy เข้ม) คอนทราสต์สูง |
| `on-surface-variant` | `#3f4850` | สีตัวอักษรรอง (Subtitles, Meta Labels) |
| `outline` | `#707881` | เส้นขอบควบคุม เส้นแบ่งกลุ่มหลัก |
| `outline-variant` | `#bfc7d2` | เส้นขอบการ์ด เส้นขอบตาราง (Subtle Border) |
| `inverse-surface` | `#213145` | พื้นหลังสีเข้มสำหรับ Shell Navigation / Tooltip |
| `inverse-on-surface` | `#eaf1ff` | ตัวอักษรบน Inverse Surface |

---

## 3. Typography (ระบบแบบอักษร)

### 3.1 Typefaces

1. **IBM Plex Sans** (Google Fonts)
   - ใช้สำหรับ Header, Title, Body, Labels, Controls
   - จุดเด่น: Terminal Geometry คมชัด แยกตัวอักษรคล้ายกันได้ดีเยี่ยม เหมาะกับงานอุตสาหกรรม
2. **JetBrains Mono** (Google Fonts)
   - ใช้สำหรับค่าตัวเลข Telemetry, รหัส Serial, Tag Sensor, Tolerance, ข้อมูลตารางที่มีตัวเลข
   - ใช้คู่กับฟีเจอร์ `tnum` (Tabular Numbers) เพื่อให้ตัวเลขมีความกว้างคงที่

### 3.2 Type Scale & Hierarchy

| Token | Family | Size | Weight | Line Height | การใช้งาน |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-xl` | IBM Plex Sans | 32px | 700 (Bold) | 40px | หัวข้อใหญ่ของแดชบอร์ดหลัก (Desktop) |
| `headline-xl-mobile` | IBM Plex Sans | 24px | 700 (Bold) | 32px | หัวข้อหลักบนจอแสดงผลขนาดเล็ก/มือถือ |
| `headline-lg` | IBM Plex Sans | 24px | 600 (Semi-bold) | 32px | หัวข้อโมดูลหลัก, Page Headers |
| `headline-md` | IBM Plex Sans | 18px | 600 (Semi-bold) | 24px | หัวข้อการ์ด, Section Title |
| `title-md` | IBM Plex Sans | 15px | 600 (Semi-bold) | 20px | หัวข้อย่อย, ชื่อกลุ่มเครื่องจักร |
| `body-lg` | IBM Plex Sans | 15px | 400 (Regular) | 22px | ข้อความอธิบายทั่วไป, รายละเอียดยาว |
| `body-md` | IBM Plex Sans | 13px | 400 (Regular) | 18px | ข้อความในเซลล์ตาราง, ค่ามาตรฐาน |
| `body-sm` | IBM Plex Sans | 12px | 400 (Regular) | 16px | คำอธิบายย่อย, หมายเหตุ |
| `label-md` | IBM Plex Sans | 12px | 600 (Semi-bold) | 16px | ข้อความบนปุ่ม, ตัวกรองข้อมูล |
| `label-sm` | IBM Plex Sans | 11px | 600 (Semi-bold) | 14px | หัวตารางตัวพิมพ์ใหญ่ (Uppercase Tracking: 0.05em) |
| `data-mono` | JetBrains Mono | 12px | 500 (Medium) | 16px | ค่าตัวเลขอ่านจากเซนเซอร์, Serial Number |

---

## 4. Spacing & Shape System

### 4.1 Corner Radius (ความโค้งมน)
- `rounded-sm`: `0.125rem` (2px)
- `rounded` (DEFAULT): `0.25rem` (4px) — สำหรับ Buttons, Inputs, Cards, Containers
- `rounded-md`: `0.375rem` (6px)
- `rounded-lg`: `0.5rem` (8px) — สำหรับ Modals และ Dialogs ใหญ่
- `rounded-full`: `9999px` — สำหรับ Status Pills / Badges เท่านั้น

### 4.2 Spacing & Margins
- `space-xs`: `0.25rem` (4px)
- `space-sm`: `0.5rem` (8px)
- `space-md`: `0.75rem` (12px)
- `space-lg`: `1.25rem` (20px)
- `space-xl`: `2rem` (32px)
- `gutter`: `1rem` (16px) | `gutter-mobile`: `0.75rem` (12px)
- `margin`: `1.5rem` (24px) | `margin-mobile`: `1rem` (16px)

---

## 5. Component Styling Standards

### 5.1 Buttons
- **Primary:** Background `#0284c7`, Text `#ffffff`, Border Radius `0.25rem` (4px), Font `label-md`, Hover `#0369a1`
- **Secondary:** Background `#1e293b`, Text `#f8fafc`, Hover `#334155`
- **Outline / Filter:** Background `transparent`, Border `1px solid #cbd5e1`, Text `#1e293b`, Hover `#f1f5f9`
- **Destructive:** Background `#e11d48`, Text `#ffffff`, Hover `#be123c`

### 5.2 Status Badges & Chips
- รูปทรง Pill (`rounded-full`), Padding `2px 8px`, Font `label-sm`, Letter Spacing `0.025em`
- มี Indicator Dot ขนาด `6px` กำกับเสมอเมื่อแสดงสถานะการทำงานจริง

### 5.3 Data Tables
- **Header:** Background `#f1f5f9`, Text `#475569`, Font `label-sm` (uppercase), Border Bottom `1px solid #e2e8f0`
- **Rows:** Background `#ffffff`, Hover `#f8f9ff`, ความสูง `36px` (Compact) หรือ `44px` (Standard)
- **Cell Content:** Padding `8px 12px`, ค่าตัวเลขชิดขวาด้วย `data-mono` (JetBrains Mono)

### 5.4 KPI Metric Telemetry Cards
- พื้นหลัง `#ffffff`, ขอบ `1px solid #e2e8f0`, Padding `1rem`
- ค่าตัวเลขขนาด `24px` Bold (IBM Plex Sans / JetBrains Mono)
- มี Micro-Status Pill ด้านขวาบน และแถบแนวโน้มเทียบ Tolerance ด้านล่าง
