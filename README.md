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
````

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

```

### Why this update is critical:
1.  **Dependency Hell:** It lists the exact `pip` packages needed so nobody gets `ModuleNotFoundError`.
2.  **The "Hidden" File:** It explicitly tells people to create the `.env` file, which Git ignores. Without this instruction, nobody else can connect to your database.
3.  **The "Two Terminal" Rule:** It clarifies that both servers must run simultaneously, preventing the "Login Failed" error you saw earlier.

**Would you like me to generate a `requirements.txt` file for you?** This would allow users to just run `pip install -r requirements.txt` instead of typing out all the package names manually. [Create a React + Flask Project](https://www.youtube.com/watch?v=Q2eafQYgglM). This video is relevant because it shows the standard way to document and structure a dual-setup project like yours.



http://googleusercontent.com/youtube_content/1
```
