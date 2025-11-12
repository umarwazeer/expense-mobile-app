# 💼 DailyKhata-App

A full-stack expense tracking application with a **Django REST API backend** and a **Vue 3 + Quasar frontend**.

---

## 🧠 Why This Project?

- Manage your daily expenses, income and track budget effortlessly.  
- Generate reports, charts, export PDFs, and use OCR features for receipts.  
- Modular architecture: backend and frontend separated for scalability.

---

## 🚀 Features

- Dashboard overview: balance, income vs expenses  
- Expense / Income entry with category management  
- Weekly & monthly reports with interactive charts  
- PDF export of reports (via jsPDF + jspdf-autotable)  
- OCR scanning of receipts (via tesseract.js)  
- Responsive mobile-first UI, PWA ready  
- Clean separation between backend and frontend code

---

## 🧑‍💻 Technologies Used

| Layer     | Technologies                                                  |
|-----------|---------------------------------------------------------------|
| Backend   | Django, Django REST Framework, SQLite3                        |
| Frontend  | Vue 3, Quasar Framework, Pinia, Vue Router                     |
| Charts    | Chart.js, ApexCharts (via vue3-apexcharts)                    |
| PDF Export| jsPDF + jspdf-autotable                                        |
| OCR       | tesseract.js                                                   |
| Build     | Vite, TailwindCSS (optional)                                   |

---

## 📁 Project Structure

│
├── backend/
│ ├── api/
│ ├── expense_manager/
│ ├── manage.py
│ ├── requirements.txt
│ └── .gitignore
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── layouts/
│ │ ├── views/
│ │ ├── composables/
│ │ ├── stores/
│ │ ├── plugins/
│ │ ├── services/
│ │ ├── utils/
│ │ └── main.ts
│ ├── tailwind.config.js
│ ├── vite.config.ts
│ ├── package.json
│ └── .gitignore
│
├── README.md
└── .gitignore
