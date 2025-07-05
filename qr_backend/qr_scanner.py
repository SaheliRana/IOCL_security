# import cv2
# from pyzbar.pyzbar import decode
# import os
# import django
# from datetime import timedelta, datetime
# import numpy as np
# from insightface.app import FaceAnalysis

# # Django setup
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "qr_backend.settings")
# django.setup()
# from django.conf import settings
# from accesscontrol.models import Worker, AttendanceLog

# # Initialize InsightFace
# face_app = FaceAnalysis(name="buffalo_l", providers=['CPUExecutionProvider'])
# face_app.prepare(ctx_id=0)  # 0 = CPU if using CPUExecutionProvider

# def scan_qr_and_verify_face():
#     cap = cv2.VideoCapture(0)
#     stage = "QR"
#     name_on_frame = ""
#     emp_on_frame = ""
#     face_verified = False
#     worker = None
#     stored_encoding = None
#     start_time = None

#     print("[INFO] Starting unified QR + Face verification. Press 'q' to quit.")

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break
#         display_frame = frame.copy()

#         if stage == "QR":
#             cv2.putText(display_frame, "Scanning QR Code...", (30, 30),
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)
#             decoded_objects = decode(frame)
#             for obj in decoded_objects:
#                 qr_data = obj.data.decode('utf-8')
#                 if '|' not in qr_data:
#                     continue
#                 employee_id, name = qr_data.split('|', 1)
#                 try:
#                     worker = Worker.objects.get(employee_id=employee_id, name=name)
#                     emp_on_frame = employee_id
#                     name_on_frame = name

#                     # Load stored embedding
#                     emb_path = os.path.join(settings.MEDIA_ROOT, "face_embeddings", f"{employee_id}.npy")
#                     if not os.path.exists(emb_path):
#                         print("[ERROR] Face embedding not found for", employee_id)
#                         continue
#                     stored_encoding = np.load(emb_path)

#                     # Display feedback
#                     cv2.putText(display_frame, f"Scanned: {name} ({employee_id})", (30, 60),
#                                 cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
#                     cv2.putText(display_frame, "Now scanning face...", (30, 90),
#                                 cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
#                     print(f"Scanned QR for {name} ({employee_id})")
#                     print(f"Verifying face for {name} ({employee_id})")

#                     start_time = datetime.now()
#                     stage = "FACE"
#                     break
#                 except Worker.DoesNotExist:
#                     print("[ERROR] Worker not found for QR data:", qr_data)
#                     continue

#         elif stage == "FACE":
#             rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#             faces = face_app.get(rgb_frame)

#             for face in faces:
#                 live_embedding = face.embedding
#                 distance = np.linalg.norm(stored_encoding - live_embedding)
#                 print(f"[DEBUG] Distance: {distance:.4f}")

#                 if distance < 25:  # You can tune this threshold (0.6–1.2)
#                     face_verified = True
#                     stage = "DONE"
#                     now = datetime.now()
#                     last_log = AttendanceLog.objects.filter(worker=worker).order_by('-timestamp').first()
#                     cooldown = timedelta(seconds=10)
#                     if not last_log or now - last_log.timestamp.replace(tzinfo=None) > cooldown:
#                         status = "IN" if last_log is None or last_log.status == "OUT" else "OUT"
#                         AttendanceLog.objects.create(worker=worker, status=status)
#                         print(f"[LOGGED] {worker.name} marked as {status}")
#                     break

#             if (datetime.now() - start_time).seconds > 10:
#                 print("[TIMEOUT] Face not verified in time.")
#                 stage = "QR"

#         elif stage == "DONE":
#             if face_verified:
#                 cv2.putText(display_frame, f"{name_on_frame} ({emp_on_frame})", (30, 30),
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
#                 cv2.putText(display_frame, "ACCESS GRANTED", (30, 60),
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
#             else:
#                 cv2.putText(display_frame, "FACE MISMATCH", (30, 60),
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

#             if (datetime.now() - start_time).seconds > 3:
#                 stage = "QR"
#                 name_on_frame = ""
#                 emp_on_frame = ""
#                 face_verified = False

#         cv2.imshow("Unified QR & Face Scanner", display_frame)
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

#     cap.release()
#     cv2.destroyAllWindows()

# if __name__ == "__main__":
#     scan_qr_and_verify_face()
import os
import ctypes

import cv2
# from pyzbar.pyzbar import decode
import os
import django
import numpy as np
from datetime import datetime, timedelta
import face_recognition

def decode_qr(frame):
    detector = cv2.QRCodeDetector()
    data, points, _ = detector.detectAndDecode(frame)
    if data:
        return [{"data": data.encode('utf-8')}]
    return []


# Django setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "qr_backend.settings")
django.setup()
from django.conf import settings
from accesscontrol.models import Worker, AttendanceLog


def scan_qr_and_verify_face():
    cap = cv2.VideoCapture(0)
    stage = "QR"
    name_on_frame = ""
    emp_on_frame = ""
    face_verified = False
    worker = None
    stored_encoding = None
    start_time = None

    print("[INFO] Starting QR + Dlib Face verification. Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        display_frame = frame.copy()

        if stage == "QR":
            cv2.putText(display_frame, "Scanning QR Code...", (30, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)
            decoded_objects = decode_qr(frame)
            for obj in decoded_objects:
                qr_data = obj["data"].decode('utf-8')
                if '|' not in qr_data:
                    continue
                employee_id, name = qr_data.split('|', 1)
                try:
                    worker = Worker.objects.get(employee_id=employee_id, name=name)
                    emp_on_frame = employee_id
                    name_on_frame = name

                    # Load stored embedding
                    emb_path = os.path.join(settings.MEDIA_ROOT, "face_embeddings", f"{employee_id}.npy")
                    if not os.path.exists(emb_path):
                        print("[ERROR] Face embedding not found for", employee_id)
                        continue
                    stored_encoding = np.load(emb_path)

                    # Show status
                    cv2.putText(display_frame, f"Scanned: {name} ({employee_id})", (30, 60),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
                    cv2.putText(display_frame, "Now scanning face...", (30, 90),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
                    print(f"✅ QR scanned for {name} ({employee_id})")
                    start_time = datetime.now()
                    stage = "FACE"
                    break
                except Worker.DoesNotExist:
                    print("[ERROR] Worker not found for QR:", qr_data)

        elif stage == "FACE":
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_frame)
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            for encoding in face_encodings:
                distance = np.linalg.norm(encoding - stored_encoding)
                print(f"[DEBUG] Distance: {distance:.4f}")

                if distance < 0.5:  # Tweak threshold if needed
                    face_verified = True
                    stage = "DONE"
                    now = datetime.now()
                    last_log = AttendanceLog.objects.filter(worker=worker).order_by('-timestamp').first()
                    cooldown = timedelta(seconds=10)
                    if not last_log or now - last_log.timestamp.replace(tzinfo=None) > cooldown:
                        status = "IN" if last_log is None or last_log.status == "OUT" else "OUT"
                        AttendanceLog.objects.create(worker=worker, status=status)
                        print(f"[LOGGED] {worker.name} marked as {status}")
                    break

            if (datetime.now() - start_time).seconds > 10:
                print("[TIMEOUT] Face not verified.")
                stage = "QR"

        elif stage == "DONE":
            if face_verified:
                cv2.putText(display_frame, f"{name_on_frame} ({emp_on_frame})", (30, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                cv2.putText(display_frame, "ACCESS GRANTED", (30, 60),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            else:
                cv2.putText(display_frame, "FACE MISMATCH", (30, 60),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

            if (datetime.now() - start_time).seconds > 3:
                stage = "QR"
                name_on_frame = ""
                emp_on_frame = ""
                face_verified = False

        cv2.imshow("QR + Dlib Face Scanner", display_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    scan_qr_and_verify_face()
    