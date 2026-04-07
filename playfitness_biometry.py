import cv2
import numpy as np
import time
import os
import json
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from supabase import create_client, Client

"""
PLAYFITNESS | ADVANCED BIOMETRIC ENGINE (ADS PROJECT)
=====================================================
Implementação de Reconhecimento Facial com Mediapipe Tasks API.
Otimizado para macOS 3.12 (Apple Silicon) com Prova de Vida (Blink).

Funcionalidades:
- Cadastro Facial (Enrollment)
- Autenticação (Authentication)
- Prova de Vida (Liveness: Piscadas) - Requisito Professor André
- Integração Supabase Cloud
"""

SUPABASE_URL = 'https://hnrrwynukzerysxgsvvl.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucnJ3eW51a3plcnlzeGdzdnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzIyOTcsImV4cCI6MjA4ODE0ODI5N30.xRt68ccB0QvgzNFIvaefMOExBMhb9GDOEd5MmC7vBHg'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class BiometryEngine:
    def __init__(self):
        # 1. Carrega o modelo neural pré-baixado
        base_options = python.BaseOptions(model_asset_path='face_landmarker.task')
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            output_face_blendshapes=True,
            output_facial_transformation_matrixes=True,
            num_faces=1,
            running_mode=vision.RunningMode.IMAGE
        )
        self.detector = vision.FaceLandmarker.create_from_options(options)
        
        self.camera = cv2.VideoCapture(0)
        self.known_face_data = [] 
        self.load_known_faces()

    def load_known_faces(self):
        print("🔄 Sincronizando Base Biométrica...")
        try:
            # Correção para sintaxe Supabase-py v2 (not_.is_)
            response = supabase.table('alunos').select('id, nome_completo, biometria_facial').not_.is_('biometria_facial', 'null').execute()
            if response.data:
                for aluno in response.data:
                    self.known_face_data.append({
                        'id': aluno['id'],
                        'name': aluno['nome_completo'],
                        'embedding': np.array(aluno['biometria_facial'])
                    })
                print(f"✅ {len(self.known_face_data)} identidades carregadas.")
        except Exception as e:
            print(f"⚠️ Erro de Banco: {e}")

    def get_landmarks(self, frame):
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame)
        result = self.detector.detect(mp_image)
        return result

    def calculate_embedding(self, result):
        if not result.face_landmarks: return None
        # Normalização geométrica espacial
        landmarks = result.face_landmarks[0]
        pts = np.array([[lm.x, lm.y, lm.z] for lm in landmarks])
        dist_eyes = np.linalg.norm(pts[33] - pts[263])
        return (pts - pts[1]).flatten() / dist_eyes

    def check_blink(self, result):
        if not result.face_blendshapes: return 0.0
        # O Mediapipe 0.10+ tem blendshapes nativos para piscada (EyeBlinkLeft/Right)
        shapes = result.face_blendshapes[0]
        blink_l = next((s.score for s in shapes if s.category_name == 'eyeBlinkLeft'), 0)
        blink_r = next((s.score for s in shapes if s.category_name == 'eyeBlinkRight'), 0)
        return (blink_l + blink_r) / 2.0

    def enroll(self, aluno_id):
        print(f"📸 MODO INSTRUTIVO: Aluno {aluno_id}")
        
        while True:
            ret, frame = self.camera.read()
            if not ret: break
            
            result = self.get_landmarks(frame)
            h, w, _ = frame.shape
            
            # Overlay de Fundo para Feedback
            cv2.rectangle(frame, (0, h-80), (w, h), (15, 15, 15), -1)
            
            if result.face_landmarks:
                landmarks = result.face_landmarks[0]
                pts = np.array([[lm.x, lm.y] for lm in landmarks.landmark])
                
                # Cálculo de Distância (Normalizado entre 0.0 e 1.0)
                dist_eyes = np.linalg.norm(pts[33] - pts[263])
                blink_score = self.check_blink(result)
                
                # LÓGICA DE COMANDOS UX
                if dist_eyes < 0.18:
                    status = "⚠️ APROXIME SEU ROSTO"
                    color = (0, 165, 255) # Laranja
                elif dist_eyes > 0.40:
                    status = "⚠️ AFASTE SEU ROSTO"
                    color = (0, 0, 255) # Vermelho
                elif blink_score < 0.3:
                    status = "👁️ PISQUE PARA VALIDAR VIVACIDADE"
                    color = (255, 255, 0) # Ciano
                else:
                    status = "✅ PERFEITO! PRESSIONE 'S' PARA SALVAR"
                    color = (0, 255, 0) # Verde
                    
                # Texto de Direcionamento
                cv2.putText(frame, status, (w//2 - 200, h-35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                
                # Desenha marcações leves no rosto para feedback visual
                self.mp_drawing.draw_landmarks(frame, landmarks, self.mp_face_mesh.FACEMESH_CONTOURS, self.drawing_spec, self.drawing_spec)
                
                if cv2.waitKey(1) & 0xFF == ord('s') and status.startswith("✅"):
                    embedding = self.calculate_embedding(result)
                    if embedding is not None:
                        supabase.table('alunos').update({"biometria_facial": embedding.tolist()}).eq('id', aluno_id).execute()
                        print("\n✨ BIOMETRIA REVISADA E SALVA!")
                        break
            else:
                cv2.putText(frame, "🔍 POSICIONE SEU ROSTO NA MOLDURA", (w//2 - 220, h-35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)

            cv2.imshow("PlayFitness | Cadastro Assistido", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'): break
        
        cv2.destroyAllWindows()

    def authenticate(self):
        print("🛡️ TERMINAL ATIVO. Pisque para autenticar.")
        blink_confirmed = False
        
        while True:
            ret, frame = self.camera.read()
            if not ret: break
            
            result = self.get_landmarks(frame)
            if result.face_landmarks:
                # 1. Reconhecimento
                curr_emb = self.calculate_embedding(result)
                blink_score = self.check_blink(result)
                
                best_match = None
                min_dist = 1.0
                
                for known in self.known_face_data:
                    d = np.linalg.norm(curr_emb - known['embedding'])
                    if d < min_dist:
                        min_dist = d
                        best_match = known

                # 2. Liveness Check (Score de piscada > 0.4)
                if blink_score > 0.4:
                    blink_confirmed = True
                    print(f"👁️ Piscada detectada! (Conf: {blink_score:.2f})")

                # UI
                color = (0, 0, 255)
                label = "ACESS NEGADO"
                if best_match and min_dist < 0.55:
                    label = f"{best_match['name'].upper()} | {min_dist:.2f}"
                    if blink_confirmed:
                        color = (0, 255, 0)
                        label += " | LIBERADO"
                        self.log_access(best_match['id'], "liberado")
                    else:
                        color = (0, 255, 255)
                        label += " | PISQUE AGORA"

                cv2.rectangle(frame, (50, 400), (600, 460), (0,0,0), -1)
                cv2.putText(frame, label, (70, 440), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

            cv2.imshow("PlayFitness | Reconhecimento Digital", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'): break

        self.camera.release()
        cv2.destroyAllWindows()

    def log_access(self, aluno_id, status):
        try:
            supabase.table('logs_acesso').insert({"aluno_id": aluno_id, "status_acesso": status, "metodo": "python_tasks_api"}).execute()
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
