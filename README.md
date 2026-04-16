# PhishGuard 🛡️

PhishGuard is an enterprise-grade phishing detection and analytics dashboard. It combines a machine learning backend for threat analysis with a modern, responsive React frontend.

## 🚀 Features
* **Machine Learning Detection:** Analyzes email headers and bodies for phishing indicators.
* **Human-in-the-Loop Retraining:** Admins can report false positives to continuously retrain the model.
* **Explainable AI:** Provides specific, human-readable reasoning for why an email was flagged.
* **Interactive Dashboards:** Visualizes threat trends, targeted departments, and security metrics.
* **Exportable Reports:** Generate clean PDF incident reports and CSV data exports.

---

## 🛠️ Tech Stack

**Frontend (Web)**
* React.js (Vite)
* Tailwind CSS (Styling)
* Recharts (Data Visualization)
* Framer Motion (UI Animations)
* Lucide React (Icons)
* jsPDF & html2canvas (Report Generation)

**Backend (API & ML)**
* Python 3.x
* Flask (API Routing)
* SQLAlchemy (Database ORM)
* Scikit-Learn (Machine Learning Models)
* Pandas & Joblib (Data Handling & Model Saving)

---

## 📦 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-username/CECS-491A-Phishguard.git
cd CECS-491A-Phishguard
\`\`\`

### 2. Backend Setup (Python)
Navigate to the root directory and install the required Python packages. It is recommended to use a virtual environment.

\`\`\`bash
# Install all required backend packages
pip install Flask Flask-Cors Flask-JWT-Extended SQLAlchemy scikit-learn pandas joblib
\`\`\`

*Note: The machine learning pipeline uses custom local modules (`ml/pipeline.py`), not the public `pipeline` pip package.*

**Start the Backend Server:**
\`\`\`bash
python -m api.app
\`\`\`
The API will run on `http://127.0.0.1:5000`.

### 3. Frontend Setup (React/Node)
Open a new terminal window, navigate to the `web` folder, and install the Node dependencies.

\`\`\`bash
cd web
npm install
\`\`\`

**Start the Frontend Development Server:**
\`\`\`bash
npm run dev
\`\`\`
The application will be accessible at `http://localhost:5173`.

---

## 🧠 Machine Learning Retraining
The Logistic Regression model is designed to learn from administrator feedback. When an admin marks an email as a "False Positive" in the UI, the backend appends the extracted features to `ml/data/historical_training_data.csv` and retrains `phish_model.pkl` on the fly to prevent future misclassifications.