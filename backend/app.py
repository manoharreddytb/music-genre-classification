from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
import os
import tempfile

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Initialize models (mock for now, you can train real models later)
svm_model = None
rf_model = None
scaler = StandardScaler()

# Genre labels
GENRES = ['Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic', 'Pop', 'Blues', 'Country']

def extract_features(audio_path):
    """
    Extract audio features using librosa
    Returns: numpy array of features
    """
    try:
        # Load audio file
        y, sr = librosa.load(audio_path, duration=30, sr=22050)
        
        # Extract MFCC features (Mel-frequency cepstral coefficients)
        mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13), axis=1)
        
        # Extract Chroma features
        chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr), axis=1)
        
        # Extract Zero Crossing Rate
        zcr = np.mean(librosa.feature.zero_crossing_rate(y))
        
        # Extract Tempo
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        
        # Combine all features into a single array
        features = np.concatenate([mfcc, chroma, [zcr, tempo]])
        
        return features
    
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Flask backend is running!'})

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict genre using pretrained models
    Accepts: audio file (mp3, wav, m4a, flac)
    Returns: predictions from SVM and Random Forest models
    """
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    
    # Create temporary file to save uploaded audio
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name
    
    try:
        # Extract features from audio
        features = extract_features(tmp_path)
        
        if features is None:
            return jsonify({'error': 'Failed to extract audio features'}), 400
        
        # Mock predictions (replace with actual model predictions later)
        # For real predictions: svm_pred = svm_model.predict([features])
        svm_genre = np.random.choice(GENRES)
        svm_confidence = np.random.uniform(0.70, 0.95)
        
        rf_genre = np.random.choice(GENRES)
        rf_confidence = np.random.uniform(0.70, 0.95)
        
        return jsonify({
            'svm': {
                'genre': svm_genre,
                'confidence': round(svm_confidence, 2)
            },
            'random_forest': {
                'genre': rf_genre,
                'confidence': round(rf_confidence, 2)
            }
        })
    
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

@app.route('/api/train', methods=['POST'])
def train():
    """
    Train custom model on user-uploaded dataset
    Accepts: dataset zip file, language parameter
    Returns: model_id and accuracy
    """
    if 'dataset' not in request.files:
        return jsonify({'error': 'No dataset provided'}), 400
    
    language = request.form.get('language', 'english')
    
    # Mock training (in production: unzip dataset, extract features, train model)
    model_id = f"custom_model_{np.random.randint(1000, 9999)}"
    accuracy = np.random.uniform(0.80, 0.95)
    
    return jsonify({
        'model_id': model_id,
        'accuracy': round(accuracy, 2),
        'language': language,
        'message': 'Model training completed successfully!'
    })

@app.route('/api/predict_custom', methods=['POST'])
def predict_custom():
    """
    Predict using custom trained model
    Accepts: audio file, model_id
    Returns: predictions from custom model + pretrained models
    """
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    model_id = request.form.get('model_id')
    audio_file = request.files['audio']
    
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name
    
    try:
        features = extract_features(tmp_path)
        
        if features is None:
            return jsonify({'error': 'Failed to extract audio features'}), 400
        
        # Mock predictions
        custom_genre = np.random.choice(GENRES)
        custom_confidence = np.random.uniform(0.85, 0.98)
        
        svm_genre = np.random.choice(GENRES)
        svm_confidence = np.random.uniform(0.70, 0.90)
        
        rf_genre = np.random.choice(GENRES)
        rf_confidence = np.random.uniform(0.70, 0.90)
        
        return jsonify({
            'custom_model': {
                'genre': custom_genre,
                'confidence': round(custom_confidence, 2)
            },
            'svm': {
                'genre': svm_genre,
                'confidence': round(svm_confidence, 2)
            },
            'random_forest': {
                'genre': rf_genre,
                'confidence': round(rf_confidence, 2)
            }
        })
    
    except Exception as e:
        print(f"Custom prediction error: {e}")
        return jsonify({'error': str(e)}), 500
    
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

if __name__ == '__main__':
    print("🎵 Music Genre Classifier Backend Starting...")
    print("📡 Backend running at: http://localhost:5000")
    print("✅ CORS enabled for frontend requests")
    app.run(host='0.0.0.0', port=5000, debug=True)