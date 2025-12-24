# Next.js E-commerce Dashboard

A high-performance, server-side rendered (SSR) administrative dashboard for managing e-commerce inventory. Built with **Next.js 15**, **Prisma**, and **MongoDB**, featuring real-time data visualization, secure image uploads, and advanced multi-step form validation.

## 🚀 Key Features

* **Server-Side Rendering (SSR):** Optimized performance and SEO using the Next.js App Router.
* **Complete CRUD:** Create, Read, Update, and Delete products seamlessly.
* **Smart Inventory Management:**
    * **Stock Adjuster:** Interactive `+` and `-` buttons to update stock levels instantly without page reloads.
    * **Visual Analytics:** Interactive bar charts showing real-time stock levels (via Recharts).
* **Advanced Product Creation:**
    * **Multi-Step Wizard:** A user-friendly 3-step form (Details → Inventory → Media) for adding products.
    * **Robust Validation:** Strong server-side and client-side validation using **Zod** and **React Hook Form**.
    * **Strict Input Rules:** Custom Regex validation ensures product names contain only letters (no numbers or special characters).
    * **Image Uploads:** Secure drag-and-drop image hosting via **Cloudinary**.
* **Database:** Fully integrated with MongoDB using Prisma ORM.

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database:** MongoDB (Atlas)
* **ORM:** Prisma
* **Forms & Validation:** React Hook Form + Zod
* **Charts:** Recharts
* **Image Storage:** Cloudinary

## 📦 Setup Instructions

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/Surajsen1729/nextjs-ecom-dashboard.git](https://github.com/Surajsen1729/nextjs-ecom-dashboard.git)
cd nextjs-ecom-dashboard
2. Install dependencies

Bash
npm install
3. Environment Setup

Create a .env file in the root directory and add your credentials:

Code snippet
# MongoDB Connection String
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecom-dashboard"

# Cloudinary Credentials
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
4. Database Synchronization

Push the Prisma schema to your MongoDB database:

Bash
npx prisma db push
5. Run the application

Start the development server:

Bash
npm run dev
Open http://localhost:3000 to view the dashboard.

📂 Project Structure
Plaintext
src/
├── app/                  
│   ├── products/new/     # Multi-step Product Creation Wizard (Client Component)
│   └── page.tsx          # Main Dashboard (SSR: Metrics, Chart, & Table)
├── components/           
│   ├── charts/           # Recharts Visualization Components
│   ├── ui/               # Reusable UI (StockAdjuster, ImageUpload, DeleteButton)
├── actions/              # Server Actions (Backend Logic & Zod Validation)
├── lib/                  # Database & Utility configurations
└── prisma/               # Database Schema
🛡️ Validation Rules
The application enforces strict data integrity:

Product Name: Must be at least 2 characters.

Price: Must be a positive number greater than 0.10.

Stock: Must be a non-negative integer.

Image: Required for all products.

Developed by Surajsen1729


### **Final Step: Upload to GitHub**
After pasting this, run these 3 commands to finish your project:
```bash
git add README.md
git commit -m "Add final documentation"
git push