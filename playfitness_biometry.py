import cv2
import numpy as np
import time
import os
import json
import pickle
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from supabase import create_client, Client

"""
PLAYFITNESS | ADVANCED BIOMETRIC ENGINE (ADS PROJECT)
=====================================================
Implementação de Reconhecimento Facial com PCA (Eigenfaces).
Baseado no TCC: "Sistema de Reconhecimento de Faces Usando PCA" (LAV Franklin, UFC).

Funcionalidades:
- Cadastro Facial com captura de múltiplas amostras (Amostragem)
- PCA (Principal Component Analysis) para criação do Espaço Facial
- Prova de Vida (Liveness: Piscadas) - Requisito Professor André
- Integração Supabase Cloud para Pesos/Weights
"""

SUPABASE_URL = 'https://hnrrwynukzerysxgsvvl.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucnJ3eW51a3plcnlzeGdzdnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzIyOTcsImV4cCI6MjA4ODE0ODI5N30.xRt68ccB0QvgzNFIvaefMOExBMhb9GDOEd5MmC7vBHg'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class PCAEngine:
    def __init__(self, target_size=(100, 100), num_components=50):
        self.target_size = target_size
        self.num_components = num_components
        self.mean_face = None
        self.eigenfaces = None
        self.model_path = 'pca_model.pkl'
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            with open(self.model_path, 'rb') as f:
                data = pickle.load(f)
                self.mean_face = data['mean']
                self.eigenfaces = data['eigenfaces']
                print("✅ Modelo PCA carregado com sucesso.")

    def save_model(self):
        with open(self.model_path, 'wb') as f:
            pickle.dump({'mean': self.mean_face, 'eigenfaces': self.eigenfaces}, f)

    def train(self, images):
        """Implementa o algoritmo descrito no TCC: Média, Covariância e Autovetores"""
        if not images: return
        # 1. Matriz de dados (N, D)
        data = np.array([img.flatten() for img in images])
        # 2. Face Média (ψ)
        self.mean_face = np.mean(data, axis=0)
        # 3. Faces de Diferença (Φ = Γ - ψ)
        diff_faces = data - self.mean_face
        # 4. Cálculo de Autovetores (Matriz de Covariância Surrogate A.T * A)
        # Usamos SVD para maior estabilidade numérica
        u, s, vt = np.linalg.svd(diff_faces, full_matrices=False)
        self.eigenfaces = vt[:self.num_components]
        self.save_model()
        print(f"🚀 Treinamento PCA Concluído. ({self.num_components} componentes)")

    def project(self, face_image):
        if self.mean_face is None: return None
        normalized = face_image.flatten() - self.mean_face
        weights = np.dot(normalized, self.eigenfaces.T)
        return weights

class BiometryEngine:
    def __init__(self):
        # 1. Carrega o modelo neural para detecção (Preservado para precisão de bounding box)
        base_options = python.BaseOptions(model_asset_path='face_landmarker.task')
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            output_face_blendshapes=True,
            output_facial_transformation_matrixes=True,
            num_faces=1,
            running_mode=vision.RunningMode.IMAGE
        )
        self.detector = vision.FaceLandmarker.create_from_options(options)
        
        self.pca = PCAEngine()
        self.camera = cv2.VideoCapture(0)
        self.known_face_data = [] 
        self.load_known_faces()
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_face_mesh = mp.solutions.face_mesh
        self.drawing_spec = self.mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

    def load_known_faces(self):
        print("🔄 Sincronizando Pesos PCA (Supabase)...")
        try:
            response = supabase.table('alunos').select('id, nome_completo, biometria_facial').not_.is_('biometria_facial', 'null').execute()
            if response.data:
                for aluno in response.data:
                    self.known_face_data.append({
                        'id': aluno['id'],
                        'name': aluno['nome_completo'],
                        'weights': np.array(aluno['biometria_facial'])
                    })
                print(f"✅ {len(self.known_face_data)} identidades sincronizadas.")
        except Exception as e:
            print(f"⚠️ Erro de Banco: {e}")

    def get_landmarks(self, frame):
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame)
        result = self.detector.detect(mp_image)
        return result

    def preprocess_face(self, frame, result):
        if not result.face_landmarks: return None
        # Crop facial baseado nos landmarks do Mediapipe
        landmarks = result.face_landmarks[0]
        h, w, _ = frame.shape
        xs = [lm.x * w for lm in landmarks]
        ys = [lm.y * h for lm in landmarks]
        x1, y1, x2, y2 = int(min(xs)), int(min(ys)), int(max(xs)), int(max(ys))
        
        # Padding
        pad = 20
        face_roi = frame[max(0, y1-pad):min(h, y2+pad), max(0, x1-pad):min(w, x2+pad)]
        if face_roi.size == 0: return None
        
        # Conversão PDF UFC: Tons de Cinza e Redimensionamento
        gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(gray, (100, 100))
        # Histogram Equalization para robustez à iluminação (mencionado no TCC)
        equalized = cv2.equalizeHist(resized)
        return equalized

    def calculate_embedding(self, result):
        # OBS: No Legacy PCA, o embedding é calculado projetando a face no Face Space
        # Este método agora é um wrapper para compatibilidade
        return None 

    def check_blink(self, result):
        if not result.face_blendshapes: return 0.0
        # O Mediapipe 0.10+ tem blendshapes nativos para piscada (EyeBlinkLeft/Right)
        shapes = result.face_blendshapes[0]
        blink_l = next((s.score for s in shapes if s.category_name == 'eyeBlinkLeft'), 0)
        blink_r = next((s.score for s in shapes if s.category_name == 'eyeBlinkRight'), 0)
        return (blink_l + blink_r) / 2.0

    def enroll(self, aluno_id):
        print(f"📸 REGISTRO PCA (UFC Protocol): Aluno {aluno_id}")
        samples = []
        
        while len(samples) < 15:
            ret, frame = self.camera.read()
            if not ret: break
            
            result = self.get_landmarks(frame)
            h, w, _ = frame.shape
            
            cv2.rectangle(frame, (0, h-80), (w, h), (15, 15, 15), -1)
            
            if result.face_landmarks:
                face_img = self.preprocess_face(frame, result)
                blink_score = self.check_blink(result)
                
                if face_img is not None:
                    if blink_score < 0.3:
                        status = f"📸 CAPTURANDO AMOSTRAS: {len(samples)}/15"
                        color = (255, 255, 0)
                        # Salva amostragem se o rosto estiver estável
                        if len(samples) < 15: samples.append(face_img)
                    else:
                        status = "👁️ NÃO PISQUE DURANTE A CAPTURA"
                        color = (0, 0, 255)
                        
                    cv2.putText(frame, status, (w//2 - 200, h-35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            
            cv2.imshow("PlayFitness | Registro PCA", frame)
            if cv2.waitKey(100) & 0xFF == ord('q'): break
        
        if len(samples) == 15:
            print("🧠 Gerando Espaço Facial...")
            self.pca.train(samples) 
            weights = self.pca.project(samples[0])
            
            if weights is not None:
                supabase.table('alunos').update({"biometria_facial": weights.tolist()}).eq('id', aluno_id).execute()
                print("\n✨ PCA REVISADO E SALVA!")
        
        cv2.destroyAllWindows()

    def authenticate(self):
        print("🛡️ PROTOCOLO PCA UFC ATIVO. Pisque para autenticar.")
        blink_confirmed = False
        
        while True:
            ret, frame = self.camera.read()
            if not ret: break
            
            result = self.get_landmarks(frame)
            if result.face_landmarks:
                # 1. Pré-processamento PCA
                face_img = self.preprocess_face(frame, result)
                if face_img is not None:
                    curr_weights = self.pca.project(face_img)
                    blink_score = self.check_blink(result)
                    
                    best_match = None
                    min_dist = 100000.0 
                    
                    if curr_weights is not None:
                        for known in self.known_face_data:
                            # Cálculo de Distância Euclidiana (Fórmula do TCC)
                            d = np.linalg.norm(curr_weights - known['weights'])
                            if d < min_dist:
                                min_dist = d
                                best_match = known

                    # 2. Liveness Check
                    if blink_score > 0.4:
                        blink_confirmed = True

                    # UI Feedback
                    color = (0, 0, 255)
                    label = "ACESSO NEGADO"
                    # Threshold ajustado para PCA (Distância maior que embeddings neurais)
                    if best_match and min_dist < 4500:
                        label = f"{best_match['name'].upper()} | DIST: {int(min_dist)}"
                        if blink_confirmed:
                            color = (0, 255, 0)
                            label += " | LIBERADO"
                            self.log_access(best_match['id'], "liberado")
                        else:
                            color = (0, 255, 255)
                            label += " | PISQUE AGORA"

                    cv2.rectangle(frame, (50, 400), (600, 460), (0,0,0), -1)
                    cv2.putText(frame, label, (70, 440), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

            cv2.imshow("PlayFitness | PCA Recognition Terminal", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'): break

        self.camera.release()
        cv2.destroyAllWindows()

    def log_access(self, aluno_id, status):
        try:
            supabase.table('logs_acesso').insert({"aluno_id": aluno_id, "status_acesso": status, "metodo": "python_pca_ufc"}).execute()
        except: pass

if __name__ == "__main__":
    engine = BiometryEngine()
    print("\n--- MENU PLAYFITNESS ---")
    print("1. Cadastrar (Enroll)")
    print("2. Acesso (Auth)")
    op = input("Seleção: ")
    if op == '1':
        engine.enroll(input("ID Aluno: "))
    elif op == '2':
        engine.authenticate()
