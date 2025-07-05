# import cv2
# import face_recognition
# import os
# import numpy as np
# from django.conf import settings

# def generate_dlib_embedding(image_path, employee_id):
#     image = cv2.imread(image_path)
#     rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

#     encodings = face_recognition.face_encodings(rgb_image)
#     if not encodings:
#         print(f"[ERROR] No face found for {employee_id}")
#         return False

#     embedding = encodings[0]
#     save_path = os.path.join(settings.MEDIA_ROOT, "face_embeddings")
#     os.makedirs(save_path, exist_ok=True)
#     np.save(os.path.join(save_path, f"{employee_id}.npy"), embedding)
#     print(f"[INFO] Saved Dlib embedding for {employee_id}")
#     return True

import cv2
import face_recognition
import os
import numpy as np
from django.conf import settings

def generate_dlib_embedding(image_path, employee_id):
    image = cv2.imread(image_path)
    if image is None:
        print(f"[ERROR] Could not read image for {employee_id}: {image_path}")
        return False

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    encodings = face_recognition.face_encodings(rgb_image)

    if not encodings:
        print(f"[ERROR] No face found for {employee_id}")
        return False

    embedding = encodings[0]  # 128-D vector
    save_dir = os.path.join(settings.MEDIA_ROOT, "face_embeddings")
    os.makedirs(save_dir, exist_ok=True)

    save_path = os.path.join(save_dir, f"{employee_id}.npy")
    np.save(save_path, embedding)
    print(f"[INFO] Saved 128D Dlib embedding for {employee_id} at {save_path}")
    return True
