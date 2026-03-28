# =========================
# 1. Import Libraries
# =========================
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report


# =========================
# 2. Load Dataset
# =========================
df = pd.read_csv("C:\\Users\\Chintu\\Downloads\\diabetes.csv")

print("Dataset Loaded Successfully!\n")


# =========================
# 3. Separate Features & Target
# =========================
X = df.drop("Outcome", axis=1)
y = df["Outcome"]

#for comparingg
def load_and_prepare_data():
    # df = pd.read_csv("C:\\Users\\Chintu\\Downloads\\diabetes.csv")
    
    X = df.drop("Outcome", axis=1)
    y = df["Outcome"]
    
    zero_cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    X[zero_cols] = X[zero_cols].replace(0, np.nan)
    
    return X, y

# =========================
# 4. Handle Invalid Zeros
# =========================
zero_cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']

# Replace 0 with NaN
X[zero_cols] = X[zero_cols].replace(0, np.nan)

print("Replaced invalid zeros with NaN\n")


# =========================
# 5. Train-Test Split
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Data Split Done!\n")


# =========================
# 6. Create Pipeline
# =========================
pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),  # fill missing values
    ("scaler", StandardScaler()),                  # normalize data
    ("model", LogisticRegression())                # classification model
])


# =========================
# 7. Train Model
# =========================
pipeline.fit(X_train, y_train)

print("Model Training Completed!\n")


# =========================
# 8. Evaluate Model
# =========================
y_pred = pipeline.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))


# =========================
# 9. Test with New Data
# =========================
# Example input:
# Pregnancies, Glucose, BloodPressure, SkinThickness,
# Insulin, BMI, DiabetesPedigreeFunction, Age

new_data = np.array([[2, 120, 70, 20, 85, 25.0, 0.5, 30]])

prediction = pipeline.predict(new_data)

print("\nNew Patient Prediction:", prediction)

if prediction[0] == 1:
    print("Diabetic")
else:
    print("Not Diabetic")


joblib.dump(pipeline, "model.pkl")

print("Model Saved Successfully!")    