# from ultralytics import YOLO
# import cv2
# import os
# import re
# from django.conf import settings
# from django.http import StreamingHttpResponse
# from playsound import playsound
# import threading
# from playsound import playsound
# import threading
# import time
# from datetime import datetime
# # Load models
# models = {
#     'helmet': YOLO('detection/helmet_detection.pt'),
#     'ifr': YOLO('detection/ifr_suit_detection.pt'),
#     'boots': YOLO('detection/shoe.pt'),
#     'completeUniform': YOLO('detection/completeUniformDetection.pt'),
# }

# # For filtering boots model only
# BOOTS_CLASS_IDS = [5,9]  # Change if needed

# # Colors
# CLASS_COLORS = {
#     'helmet': (0, 255, 0),
#     'no_helmet': (255, 0, 0),
#     'ifr_suit': (255, 165, 0),
#     'no_ifr_suit': (128, 0, 128),
#     'people': (255, 255, 0),
#     'gloves': (255, 105, 180),
#     'no_gloves': (0, 255, 255),
#     'safety_boots': (0, 255, 0),
#     'no_safety_boots': (0, 0, 255),
# }

# def sanitize_filename(name):
#     return re.sub(r'[^a-zA-Z0-9_-]', '_', name)

# def process_video(input_path, model_key, output_path=None):
#     model = models.get(model_key)
#     if model is None:
#         raise ValueError(f"Invalid model key: {model_key}")

#     cap = cv2.VideoCapture(input_path)
#     fps = cap.get(cv2.CAP_PROP_FPS)
#     width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#     height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

#     output_dir = os.path.join(settings.MEDIA_ROOT, 'result')
#     os.makedirs(output_dir, exist_ok=True)

#     if not output_path:
#         base_name = os.path.splitext(os.path.basename(input_path))[0]
#         safe_name = sanitize_filename(base_name)
#         output_filename = f"{safe_name}_{model_key}.mp4"
#         output_path = os.path.join(output_dir, output_filename)

#     out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         results = model.predict(frame, verbose=False)[0]

#         for box in results.boxes:
#             cls_id = int(box.cls[0])
#             if model_key == 'boots' and cls_id not in BOOTS_CLASS_IDS:
#                 continue

#             x1, y1, x2, y2 = map(int, box.xyxy[0])
#             conf = float(box.conf[0])
#             label = model.names[cls_id]
#             key = label.lower().replace(" ", "_")
#             color = CLASS_COLORS.get(key, (255, 255, 255))

#             cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
#             cv2.putText(frame, f'{label} {conf:.2f}', (x1, max(20, y1 - 10)),
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

#         out.write(frame)

#     cap.release()
#     out.release()
#     return output_path


# #------------alert ------------------

# def play_alert_sound():
#     def _play():
#         try:
#             playsound(os.path.join(settings.MEDIA_ROOT, 'alerts', 'alert.mp3'))
#         except Exception as e:
#             print("Sound error:", e)
#     threading.Thread(target=_play, daemon=True).start()
# # ----------- Live Feed Detection --------------


# import time
# from datetime import datetime

# VIOLATIONS = ['head', 'NO-IFR-SUIT', 'No Safety Boots']
# violation_start = {}
# last_snapshot_time = {}

# SNAPSHOT_DIR = os.path.join(settings.MEDIA_ROOT, 'snapshots')
# os.makedirs(SNAPSHOT_DIR, exist_ok=True)

# def process_live_feed(model_key):
#     model = models.get(model_key)
#     if not model:
#         raise ValueError(f"Invalid model key: {model_key}")

#     cap = cv2.VideoCapture(0)

#     try:
#         while True:
#             ret, frame = cap.read()
#             if not ret:
#                 break

#             now = time.time()
#             results = model.predict(frame, verbose=False)[0]
#             current_violation_classes = set()

#             for box in results.boxes:
#                 cls_id = int(box.cls[0])
#                 label = model.names[cls_id].lower().replace(" ", "_")

#                 # skip unwanted class for boots model
#                 if model_key == 'boots' and cls_id not in BOOTS_CLASS_IDS:
#                     continue

#                 if label in VIOLATIONS:
#                     current_violation_classes.add(label)
#                     # Start timer if not already tracking
#                     if label not in violation_start:
#                         violation_start[label] = now
#                     # Check if violation persisted
#                     elif now - violation_start[label] >= 3:
#                         # Check cooldown
#                         last_time = last_snapshot_time.get(label, 0)
#                         if now - last_time >= 15:
#                             timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#                             filename = f"{label}_{timestamp}.jpg"
#                             filepath = os.path.join(SNAPSHOT_DIR, filename)
#                             cv2.imwrite(filepath, frame)
#                             print(f"📸 Snapshot saved: {filepath}")
#                             last_snapshot_time[label] = now
#                 else:
#                     # Reset timer if no longer detected
#                     violation_start.pop(label, None)

#                 # Draw box as usual
#                 x1, y1, x2, y2 = map(int, box.xyxy[0])
#                 conf = float(box.conf[0])
#                 color = CLASS_COLORS.get(label, (255, 255, 255))
#                 cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
#                 cv2.putText(frame, f'{label} {conf:.2f}', (x1, max(20, y1 - 10)),
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

#             # Reset timers for violations no longer detected
#             for label in list(violation_start):
#                 if label not in current_violation_classes:
#                     violation_start.pop(label)

#             # Stream frame
#             ret, jpeg = cv2.imencode('.jpg', frame)
#             if not ret:
#                 continue
#             frame_bytes = jpeg.tobytes()
#             yield (b'--frame\r\n'
#                 b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

#     except GeneratorExit:
#         print("Live feed client disconnected.")
#     finally:
#         cap.release()




from ultralytics import YOLO
import cv2
import os
import re
from django.conf import settings
from django.http import StreamingHttpResponse
from playsound import playsound
import threading
import time
from datetime import datetime

# Load models
models = {
    'helmet': YOLO('detection/helmet_detection.pt'),
    'ifr': YOLO('detection/ifr_suit_detection.pt'),
    'boots': YOLO('detection/shoe.pt'),
    'completeUniform': YOLO('detection/completeUniformDetection.pt'),
}

# Boots filtering class IDs
BOOTS_CLASS_IDS = [5, 9]

# Colors for each class
CLASS_COLORS = {
    'helmet': (0, 255, 0),
    'no_helmet': (255, 0, 0),
    'ifr_suit': (255, 165, 0),
    'no_ifr_suit': (128, 0, 128),
    'people': (255, 255, 0),
    'gloves': (255, 105, 180),
    'no_gloves': (0, 255, 255),
    'safety_boots': (0, 255, 0),
    'no_safety_boots': (0, 0, 255),
}

# Sanitize filenames
def sanitize_filename(name):
    return re.sub(r'[^a-zA-Z0-9_-]', '_', name)

# ========== Video Upload Detection ==========
def process_video(input_path, model_key, output_path=None):
    model = models.get(model_key)
    if model is None:
        raise ValueError(f"Invalid model key: {model_key}")

    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    output_dir = os.path.join(settings.MEDIA_ROOT, 'result')
    os.makedirs(output_dir, exist_ok=True)

    if not output_path:
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        safe_name = sanitize_filename(base_name)
        output_filename = f"{safe_name}_{model_key}.mp4"
        output_path = os.path.join(output_dir, output_filename)

    out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(frame, verbose=False)[0]
        for box in results.boxes:
            cls_id = int(box.cls[0])
            if model_key == 'boots' and cls_id not in BOOTS_CLASS_IDS:
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            label = model.names[cls_id]
            key = label.lower().replace(" ", "_")
            color = CLASS_COLORS.get(key, (255, 255, 255))

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, f'{label} {conf:.2f}', (x1, max(20, y1 - 10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        out.write(frame)

    cap.release()
    out.release()
    return output_path

# ========== Live Feed Detection ==========

# Violation settings
VIOLATIONS = ['head', 'no_ifr_suit', 'no_safety_boots']
violation_start = {}
last_snapshot_time = {}

# Snapshot directory
SNAPSHOT_DIR = os.path.join(settings.MEDIA_ROOT, 'snapshots')
os.makedirs(SNAPSHOT_DIR, exist_ok=True)

# Alert sound trigger
def play_alert_sound():
    def _play():
        try:
            alert_path = os.path.join(settings.MEDIA_ROOT, 'alert', 'alert.mp3')
            playsound(alert_path)
        except Exception as e:
            print("🔊 Sound error:", e)
    threading.Thread(target=_play, daemon=True).start()

def process_live_feed(model_key):
    model = models.get(model_key)
    if not model:
        raise ValueError(f"Invalid model key: {model_key}")

    cap = cv2.VideoCapture(0)

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            now = time.time()
            results = model.predict(frame, verbose=False)[0]
            current_violation_classes = set()

            for box in results.boxes:
                cls_id = int(box.cls[0])
                label = model.names[cls_id].lower().replace(" ", "_")

                if model_key == 'boots' and cls_id not in BOOTS_CLASS_IDS:
                    continue

                if label in VIOLATIONS:
                    current_violation_classes.add(label)
                    if label not in violation_start:
                        violation_start[label] = now
                    elif now - violation_start[label] >= 3:
                        last_time = last_snapshot_time.get(label, 0)
                        if now - last_time >= 15:
                            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                            filename = f"{label}_{timestamp}.jpg"
                            filepath = os.path.join(SNAPSHOT_DIR, filename)
                            cv2.imwrite(filepath, frame)
                            print(f"📸 Snapshot saved: {filepath}")
                            play_alert_sound()
                            last_snapshot_time[label] = now
                else:
                    violation_start.pop(label, None)

                # Draw box
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf[0])
                color = CLASS_COLORS.get(label, (255, 255, 255))
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, f'{label} {conf:.2f}', (x1, max(20, y1 - 10)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

            for label in list(violation_start):
                if label not in current_violation_classes:
                    violation_start.pop(label)

            # Encode and yield JPEG
            ret, jpeg = cv2.imencode('.jpg', frame)
            if not ret:
                continue
            frame_bytes = jpeg.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    except GeneratorExit:
        print("🛑 Live feed client disconnected.")
    finally:
        cap.release()
