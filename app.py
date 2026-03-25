# =========================
# 1. Import Libraries
# =========================
import streamlit as st
import joblib
import numpy as np

# =========================
# 2. Load Model
# =========================
# model = joblib.load("C:\\Users\\Chintu\\Desktop\\coding\\model.pkl")
model = joblib.load("model.pkl")
# =========================
# 3. App Title
# =========================
st.set_page_config(page_title="Diabetes Predictor", layout="centered")

st.title("🩺 Diabetes Prediction App")
st.write("Enter patient details to check diabetes risk")

# =========================
# 4. Input Fields
# =========================
pregnancies = st.number_input("Pregnancies", min_value=0, max_value=20, value=1)
glucose = st.number_input("Glucose Level", min_value=0, max_value=300, value=120)
bp = st.number_input("Blood Pressure", min_value=0, max_value=200, value=70)
skin = st.number_input("Skin Thickness", min_value=0, max_value=100, value=20)
insulin = st.number_input("Insulin Level", min_value=0, max_value=900, value=80)
bmi = st.number_input("BMI", min_value=0.0, max_value=70.0, value=25.0)
dpf = st.number_input("Diabetes Pedigree Function", min_value=0.0, max_value=3.0, value=0.5)
age = st.number_input("Age", min_value=1, max_value=120, value=30)

# =========================
# 5. Prediction Button
# =========================
if st.button("Predict"):

    # Convert input to numpy array
    data = np.array([[pregnancies, glucose, bp, skin, insulin, bmi, dpf, age]])

    # Prediction
    prediction = model.predict(data)

    # =========================
    # 6. Output Result
    # =========================
    if prediction[0] == 1:
        st.error("⚠️ High Risk of Diabetes")
    else:
        st.success("✅ Low Risk (Not Diabetic)")