# Flask Backend Setup Guide for VSCode

This guide provides step-by-step instructions to set up the Flask backend for the Music Genre Classifier in VSCode.

## Project Structure

Your project should have this structure:

```
music-genre-classifier/
├── frontend/              # React frontend (current Lovable project)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/              # Flask backend (you'll create this)
│   ├── app.py
│   ├── requirements.txt
│   ├── models/          # Pretrained models (optional)
│   └── datasets/        # GTZAN dataset (optional)
```

## Step 1: Create Backend Folder Structure

1. Open your terminal in VSCode (Terminal → New Terminal)
2. Navigate to your project root directory
3. Create the backend folder and files:

```bash
mkdir backend
cd backend
```

## Step 2: Create Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

## Step 3: Create requirements.txt

Create a file named `requirements.txt` in the `backend` folder with this content:

```txt
Flask==3.0.0
Flask-CORS==4.0.0
librosa==0.10.1
scikit-learn==1.3.2
numpy==1.24.3
soundfile==0.12.1
```

## Step 4: Install Dependencies

With your virtual environment activated, run:

```bash
pip install -r requirements.txt
```

This will take a few minutes as it installs all packages.

## Step 5: Create app.py

Create a file named `app.py` in the `backend` folder with this content:

```python
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
```

## Step 6: Run the Backend

1. Make sure your virtual environment is activated (you should see `(venv)` in terminal)
2. Run the Flask app:

```bash
python app.py
```

You should see:
```
🎵 Music Genre Classifier Backend Starting...
📡 Backend running at: http://localhost:5000
✅ CORS enabled for frontend requests
```

## Step 7: Test the Backend

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:5000/health
```

You should get: `{"status":"healthy","message":"Flask backend is running!"}`

## Step 8: Run the Frontend

1. Open a NEW terminal (keep the backend running)
2. Navigate to your frontend directory:

```bash
cd frontend  # or wherever your React app is
npm install  # if you haven't already
npm run dev
```

3. Open your browser to `http://localhost:5173` (or whatever port Vite shows)

## API Endpoints

Your Flask backend now has these endpoints:

- `GET /health` - Check if backend is running
- `POST /api/predict` - Predict genre from uploaded audio file
- `POST /api/train` - Train custom model on uploaded dataset
- `POST /api/predict_custom` - Predict using custom trained model

## Common Issues & Solutions

### Issue: "ModuleNotFoundError"
**Solution:** Make sure your virtual environment is activated and you ran `pip install -r requirements.txt`

### Issue: "Port 5000 already in use"
**Solution:** Change the port in `app.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)
```
Also update the frontend fetch URLs to use port 5001.

### Issue: "CORS error in browser"
**Solution:** Make sure `Flask-CORS` is installed and `CORS(app)` is in your code.

### Issue: librosa installation fails
**Solution:** You might need to install system dependencies:
- **Windows:** Install Microsoft Visual C++ Build Tools
- **Mac:** `brew install libsndfile`
- **Linux:** `sudo apt-get install libsndfile1`

## Training Real Models (Optional Advanced)

To train actual models instead of mock predictions:

1. Download the GTZAN dataset
2. Create `train_models.py`:

```python
import librosa
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle
import os

def extract_features(file_path):
    y, sr = librosa.load(file_path, duration=30)
    mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13), axis=1)
    chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr), axis=1)
    zcr = np.mean(librosa.feature.zero_crossing_rate(y))
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    return np.concatenate([mfcc, chroma, [zcr, tempo]])

# Load GTZAN dataset and extract features for all songs
# Train models
# Save models:
# with open('svm_model.pkl', 'wb') as f:
#     pickle.dump(svm_model, f)
```

3. Load models in `app.py`:
```python
with open('models/svm_model.pkl', 'rb') as f:
    svm_model = pickle.load(f)
```

## Next Steps

- Test all three pages: Predict, Train, and Record
- Upload audio files and see predictions
- Record your voice and see what genre it matches
- Customize the genres list for different languages
- Train actual ML models for better predictions

## Questions?

If you encounter issues:
1. Check that both backend (port 5000) and frontend (port 5173) are running
2. Check browser console for errors (F12)
3. Check Flask terminal for error messages
4. Make sure audio files are in supported formats (mp3, wav, m4a, flac)
