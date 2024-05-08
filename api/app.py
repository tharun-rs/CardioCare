from flask import Flask, request, jsonify
from torch_utils import transform_image, get_prediction, is_ecg

app = Flask(__name__)

ALLOWED_EXTENSIONS = ('png','jpg','jpeg')
CLASSES_OF_PREDICTION = ('Arrhythmia', 'Myocardial Infarction', 'Normal', 'History of MI')

def allowed_file(file_name):
    return '.' in file_name and file_name.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        file = request.files.get('file')
        if file is None or file.filename == "":
            return  jsonify({'error':'No file'})
        if not allowed_file(file.filename):
            return jsonify({'error':'Format not supported'})
        
        try:
            imgage_bytes = file.read()
            if not is_ecg(imgage_bytes):
                return jsonify({'error': 'Not an ECG Image'})
            img_tensor = transform_image(imgage_bytes)
            prediction = get_prediction(img_tensor)
            print(prediction.item())
            predicted_class = CLASSES_OF_PREDICTION[prediction.item()]
            print(predicted_class)
            return jsonify({'class':predicted_class})

        except:
            print(Exception)
            return jsonify({'error':'Error during prediction'})



if __name__ == '__main__':
    app.run(debug=False)