# =========================
# 1. Import Libraries
# =========================
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC

# IMPORT your function
from model import load_and_prepare_data


# =========================
# 2. Load Data (REUSED)
# =========================
X, y = load_and_prepare_data()

# =========================
# 3. Train-Test Split
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# 4. Model Comparison
# =========================
models = {
    "Logistic": LogisticRegression(),
    "SVM": SVC()
}

print("Model Comparison:\n")

for name, model in models.items():
    pipe = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("model", model)
    ])
    
    pipe.fit(X_train, y_train)
    acc = pipe.score(X_test, y_test)
    
    print(f"{name} Accuracy: {acc:.4f}")