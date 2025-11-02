import os
import numpy as np
import librosa
import pickle
import zipfile
import requests
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
from tqdm import tqdm

# Where to store data
DATASET_PATH = "datasets/GTZAN"
DATASET_ZIP = "datasets/gtzan.zip"
DATASET_URL = "https://github.com/mdeff/fma/releases/download/v1.0/gtzan.zip"  # a stable mirror link

GENRES = ['blues', 'classical', 'country', 'disco', 'hiphop',
          'jazz', 'metal', 'pop', 'reggae', 'rock']

def download_dataset():
    os.makedirs("datasets", exist_ok=True)
    if not os.path.exists(DATASET_PATH):
        print("🌐 Downloading GTZAN dataset...")
        response = requests.get(DATASET_URL, stream=True)
        total = int(response.headers.get('content-length', 0))

        with open(DATASET_ZIP, 'wb') as file, tqdm(
                desc="Downloading gtzan.zip",
                total=total,
                unit='iB',
                unit_scale=True,
                unit_divisor=1024) as bar:
            for data in response.iter_content(chunk_size=1024):
                size = file.write(data)
                bar.update(size)

        print("📦 Extracting...")
        with zipfile.ZipFile(DATASET_ZIP, 'r') as zip_ref:
            zip_ref.extractall("datasets")

        print("✅ Dataset ready at:", DATASET_PATH)

def extract_features(file_path):
    try:
        y, sr = librosa.load(file_path, duration=30)
        mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13), axis=1)
        chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr), axis=1)
        zcr = np.mean(librosa.feature.zero_crossing_rate(y))
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        return np.concatenate([mfcc, chroma, [zcr, tempo]])
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return None

def load_dataset(dataset_path):
    X, y = [], []
    for genre in GENRES:
        genre_path = os.path.join(dataset_path, genre)
        if not os.path.exists(genre_path):
            print(f"⚠️ Skipping missing folder: {genre_path}")
            continue
        print(f"🎧 Processing {genre}...")
        for filename in tqdm(os.listdir(genre_path)):
            if filename.endswith(('.wav', '.au', '.mp3')):
                file_path = os.path.join(genre_path, filename)
                features = extract_features(file_path)
                if features is not None:
                    X.append(features)
                    y.append(genre)
    return np.array(X), np.array(y)

def train_and_save_models(X, y):
    print("🧹 Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("🧠 Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y)

    print("🚀 Training SVM...")
    svm_model = SVC(kernel='rbf', probability=True)
    svm_model.fit(X_train, y_train)

    print("🌲 Training Random Forest...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)

    print("✅ Evaluating models...")
    svm_pred = svm_model.predict(X_test)
    rf_pred = rf_model.predict(X_test)

    print(f"SVM Accuracy: {accuracy_score(y_test, svm_pred):.2f}")
    print(f"RF Accuracy: {accuracy_score(y_test, rf_pred):.2f}")

    os.makedirs("models", exist_ok=True)
    with open("models/svm_model.pkl", "wb") as f:
        pickle.dump(svm_model, f)
    with open("models/rf_model.pkl", "wb") as f:
        pickle.dump(rf_model, f)
    with open("models/scaler.pkl", "wb") as f:
        pickle.dump(scaler, f)

    print("💾 Models saved in /backend/models/")

if __name__ == "__main__":
    if not os.path.exists(DATASET_PATH):
        download_dataset()
    print("🎶 Loading dataset...")
    X, y = load_dataset(DATASET_PATH)
    print(f"✅ Loaded {len(X)} samples.")
    train_and_save_models(X, y)
