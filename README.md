# PhishGuard - Admin Dashboard

## 📋 Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.10 or higher)
- **PostgreSQL Database** (Neon.tech recommended)

---

## 🚀 Quick Start Guide

You need to run the **Backend** and **Frontend** in two separate terminals.

### 1️⃣ Backend Setup (The Brain)

1. **Navigate to the root directory**:
   ```bash
   cd CECS-491A-Phishguard


2.  **Install Python Dependencies**:

    ```bash
    pip install flask flask-jwt-extended flask-cors python-dotenv sqlalchemy psycopg2-binary
    ```

3.  **Configure Environment Variables**:

      * Create a file named `.env` inside the `api/` folder.
      * Add the following content (ask Matthew for the real credentials):
        ```env
        # api/.env
        DB_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-square-frost.us-east-2.aws.neon.tech/neondb?sslmode=require
        SECRET_KEY=dev-secret-key
        JWT_SECRET_KEY=dev-jwt-key
        ```

4.  **Start the Server**:

    ```bash
    python -m api.app
    ```

    *Success Message:* `Running on http://127.0.0.1:5000`

-----

### 2️⃣ Frontend Setup (The Interface)

1.  **Open a NEW terminal**.

2.  **Navigate to the web directory**:

    ```bash
    cd web
    ```

3.  **Install Dependencies** (Only needed once):

    ```bash
    npm install
    ```

4.  **Start the UI**:

    ```bash
    npm run dev
    ```

    *Success Message:* `Local: http://localhost:5173/`

-----

## 🛠 Troubleshooting

  * **"Backend not running?"**: Ensure you have the Python terminal open and see "Running on http://127.0.0.1:5000".
  * **"Invalid Credentials"**: You likely need to create a local admin user. Run the helper script:
    ```bash
    python create_admin.py
    ```
  * **"DB\_URL is missing"**: Make sure your `.env` file is named exactly `.env` (not `.env.txt`) and is located inside the `api/` folder.

<!-- end list -->
