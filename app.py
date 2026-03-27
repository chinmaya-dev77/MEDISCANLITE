from flask import Flask, request, jsonify, render_template
import joblib, numpy as np
import os

app = Flask(__name__)
model = joblib.load("model.pkl")

@app.route('/')
def home():
    return render_template("index.html")
@app.route('/predict', methods=['POST'])
def predict():
    d = request.json

    data = np.array([[d['pregnancies'], d['glucose'], d['bp'],
                      d['skin'], d['insulin'], d['bmi'],
                      d['dpf'], d['age']]])

    prediction = int(model.predict(data)[0])   # 0 or 1
    proba = model.predict_proba(data)[0][1]    # probability

    return jsonify({
        "prediction": prediction,
        "confidence": round(proba * 100, 2)
    })
# if __name__ == "__main__":
#     app.run(debug=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))