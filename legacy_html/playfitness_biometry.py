import cv2
import numpy as np
import time
import os
import pickle
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from ultralytics import YOLO
from supabase import create_client, Client

"""
PLAYFITNESS | ULTIMATE BIOMETRIC ENGINE (YOLOv8 + MEDIAPIPE TASKS + PCA)
========================================================================
Módulo Atualizado: Utiliza a nova API de Tasks do Mediapipe (vision.FaceLandmarker)
para compatibilidade total com instalações modernas.
"""

# Configurações Supabase
SUPABASE_URL = 'https://hnrrwynukzerysxgsvvl.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucnJ3eW51a3plcnlzeGdzdnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzIyOTcsImV4cCI6MjA4ODE0ODI5N30.xRt68ccB0QvgzNFIvaefMOExBMhb9GDOEd5MmC7vBHg'

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except:
    print("⚠️ Falha na conexão Supabase. Operando em modo offline.")

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

    def train(self, images):
        if not images: return
        data = np.array([img.flatten() for img in images])
        self.mean_face = np.mean(data, axis=0)
        diff_faces = data - self.mean_face
        u, s, vt = np.linalg.svd(diff_faces, full_matrices=False)
        self.eigenfaces = vt[:self.num_components]
        with open(self.model_path, 'wb') as f:
            pickle.dump({'mean': self.mean_face, 'eigenfaces': self.eigenfaces}, f)

    def project(self, face_image):
        if self.mean_face is None: return None
        normalized = face_image.flatten() - self.mean_face
        return np.dot(normalized, self.eigenfaces.T)

class BiometryEngine:
    def __init__(self):
        print("🚀 Inicializando Sistema Híbrido Moderno (API Tasks)...")
        # 1. YOLOv8
        self.yolo = YOLO('yolov8n.pt')
        
        # 2. Mediapipe FaceLandmarker (Nova API)
        base_options = python.BaseOptions(model_asset_path='face_landmarker.task')
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            output_face_blendshapes=True,
            num_faces=1,
            running_mode=vision.RunningMode.IMAGE
        )
        self.landmarker = vision.FaceLandmarker.create_from_options(options)
        
        self.pca = PCAEngine()
        self.camera = cv2.VideoCapture(0)
        self.known_faces = []
        self.load_database()

    def load_database(self):
        print("🔄 Sincronizando Banco de Alunos (Supabase)...")
        try:
            res = supabase.table('alunos').select('id, nome_completo, biometria_facial').not_.is_('biometria_facial', 'null').execute()
            if res.data:
                self.known_faces = res.data
                print(f"✅ {len(self.known_faces)} alunos carregados.")
        except: print("⚠️ Erro de sincronização.")

    def check_blink(self, face_roi):
        """Usa blendshapes do landmarker moderno para detectar piscada"""
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB))
        result = self.landmarker.detect(mp_image)
        if result.face_blendshapes:
            shapes = result.face_blendshapes[0]
            blink_l = next((s.score for s in shapes if s.category_name == 'eyeBlinkLeft'), 0)
            blink_r = next((s.score for s in shapes if s.category_name == 'eyeBlinkRight'), 0)
            return (blink_l + blink_r) / 2.0
        return 0.0

    def enroll(self, aluno_id):
        print(f"📸 INICIANDO CADASTRO PARA ALUNO ID: {aluno_id}")
        samples = []
        while len(samples) < 15:
            ret, frame = self.camera.read()
            if not ret: break
            
            results = self.yolo(frame, verbose=False, conf=0.6)[0]
            for box in results.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                face_roi = frame[max(0, y1):y2, max(0, x1):x2]
                
                if face_roi.size > 0:
                    gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
                    resized = cv2.resize(gray, (100, 100))
                    equalized = cv2.equalizeHist(resized)
                    
                    samples.append(equalized)
                    cv2.putText(frame, f"Capturando: {len(samples)}/15", (x1, y1-10), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            cv2.imshow("Cadastro Biometrico YOLO", frame)
            if cv2.waitKey(200) & 0xFF == ord('q'): break

        if len(samples) == 15:
            print("🧠 Treinando Espaço Facial...")
            self.pca.train(samples) 
            weights = self.pca.project(samples[0])
            supabase.table('alunos').update({"biometria_facial": weights.tolist()}).eq('id', aluno_id).execute()
            print("✨ BIOMETRIA SINCRONIZADA!")
        
        cv2.destroyAllWindows()

    def authenticate(self):
        print("\n🛡️ SISTEMA DE ACESSO ATIVO. Pressione 'Q' para sair.")
        while True:
            ret, frame = self.camera.read()
            if not ret: break

            yolo_results = self.yolo(frame, verbose=False, conf=0.4)[0]
            for box in yolo_results.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                face_roi = frame[max(0, y1):y2, max(0, x1):x2]
                
                if face_roi.size > 100:
                    blink_score = self.check_blink(face_roi)

                    gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
                    resized = cv2.resize(gray, (100, 100))
                    equalized = cv2.equalizeHist(resized)
                    
                    curr_weights = self.pca.project(equalized)
                    
                    best_match = None
                    min_dist = float('inf')
                    
                    if curr_weights is not None:
                        for al in self.known_faces:
                            dist = np.linalg.norm(curr_weights - np.array(al['biometria_facial']))
                            if dist < min_dist:
                                min_dist = dist
                                best_match = al

                    color = (0, 0, 255)
                    status = "NEGADO"
                    if best_match and min_dist < 4600:
                        color = (0, 255, 255)
                        status = f"{best_match['nome_completo'].split()[0]} | PISQUE"
                        
                        if blink_score > 0.4:
                            color = (0, 255, 0)
                            status = "LIBERADO"
                            self.log_access(best_match['id'], "sucesso")

                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    cv2.rectangle(frame, (x1, y1-30), (x2, y1), color, -1)
                    cv2.putText(frame, status, (x1+5, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 2)

            cv2.imshow("PlayFitness | Catraca Advanced (YOLO + PCA)", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'): break

        self.camera.release()
        cv2.destroyAllWindows()

    def log_access(self, aluno_id, status):
        try:
            supabase.table('logs_acesso').insert({"aluno_id": aluno_id, "status_acesso": status, "metodo": "YOLO-PCA-Hybrid"}).execute()
        except: pass

if __name__ == "__main__":
    engine = BiometryEngine()
    print("\n--- MENU PLAYFITNESS BIOMETRIA ---")
    print("1. Cadastrar Novo Aluno (Enroll)")
    print("2. Iniciar Modo Catraca (Auth)")
    op = input("Seleção: ")
    if op == '1':
        id_aluno = input("Digite o ID do Aluno: ")
        engine.enroll(id_aluno)
    elif op == '2':
        engine.authenticate()
