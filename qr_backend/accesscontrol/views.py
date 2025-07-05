from django.shortcuts import render
from accesscontrol.models import AttendanceLog, Worker
from django.db.models import Max
from django.utils import timezone
from datetime import timedelta
import csv
from django.http import HttpResponse
import os
import cv2
import numpy as np
from django.conf import settings
from django.http import JsonResponse

def get_currently_inside_count():
    latest_logs = AttendanceLog.objects.values('worker').annotate(latest=Max('timestamp'))
    count = 0
    for log in latest_logs:
        latest = AttendanceLog.objects.filter(worker=log['worker'], timestamp=log['latest']).first()
        if latest.status == 'IN':
            count += 1
    return count

def dashboard_view(request):
    count = get_currently_inside_count()
    
    # Get details of workers currently checked-in
    latest_logs = AttendanceLog.objects.values('worker').annotate(latest=Max('timestamp'))
    checked_in_workers = []
    
    for log in latest_logs:
        latest = AttendanceLog.objects.filter(worker=log['worker'], timestamp=log['latest']).first()
        if latest.status == 'IN':
            checked_in_workers.append(latest.worker)

    
    return render(request, "accesscontrol/dashboard.html", {
        'count': count,
        'workers': checked_in_workers,
    })

def dashboard_data_view(request):
    count = get_currently_inside_count()
    
    latest_logs = AttendanceLog.objects.values('worker').annotate(latest=Max('timestamp'))
    checked_in_workers = []
    
    for log in latest_logs:
        latest = AttendanceLog.objects.filter(worker=log['worker'], timestamp=log['latest']).select_related('worker').first()
        if latest.status == 'IN':
            checked_in_workers.append({
                'name': latest.worker.name,
                'employee_id': latest.worker.employee_id
            })

    return JsonResponse({
        'count': count,
        'workers': checked_in_workers
    })

def overtime_alert_view(request):
    overtime_threshold = timedelta(hours=10)
    now = timezone.now()

    # Find latest log for each worker
    latest_logs = AttendanceLog.objects.values('worker').annotate(latest=Max('timestamp'))
    
    overtime_workers = []
    for log in latest_logs:
        entry = AttendanceLog.objects.get(worker_id=log['worker'], timestamp=log['latest'])
        if entry.status == 'IN' and (now - entry.timestamp) > overtime_threshold:
            overtime_workers.append(entry)

    return render(request, 'accesscontrol/overtime_alerts.html', {
        'overtime_logs': overtime_workers
    })


def overtime_alert_data_view(request):
    overtime_threshold = timedelta(hours=10)
    now = timezone.now()

    # Get latest timestamp per worker
    latest_logs = AttendanceLog.objects.values('worker').annotate(latest=Max('timestamp'))

    overtime_workers = []
    for log in latest_logs:
        entry = AttendanceLog.objects.filter(worker_id=log['worker'], timestamp=log['latest']).select_related('worker').first()
        if entry.status == 'IN' and (now - entry.timestamp) > overtime_threshold:
            overtime_workers.append({
                'name': entry.worker.name,
                'employee_id': entry.worker.employee_id,
                'checked_in_at': entry.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            })

    return JsonResponse({
        'overtime_workers': overtime_workers
    })


def export_attendance_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="attendance_logs.csv"'

    writer = csv.writer(response)
    writer.writerow(['Worker Name', 'Employee ID', 'Status', 'Timestamp'])

    logs = AttendanceLog.objects.select_related('worker').order_by('-timestamp')
    for log in logs:
        writer.writerow([log.worker.name, log.worker.employee_id, log.status, log.timestamp])

    return response

def export_currently_inside_csv(request):
    latest_logs = AttendanceLog.objects.values('worker').annotate(latest=Max('timestamp'))

    currently_inside = []
    for log in latest_logs:
        latest = AttendanceLog.objects.filter(worker=log['worker'], timestamp=log['latest']).first()
        if latest.status == 'IN':
            currently_inside.append(latest.worker)

    # Create the HttpResponse object with CSV header
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="currently_inside.csv"'

    writer = csv.writer(response)
    writer.writerow(['Name', 'Employee ID'])

    for worker in currently_inside:
        writer.writerow([worker.name, worker.employee_id])

    return response

# accesscontrol/views.py
import subprocess
from django.http import JsonResponse
import sys

def run_qr_scanner(request):
    try:
        subprocess.run([sys.executable, 'qr_scanner.py'])
        return JsonResponse({"status": "started"})
    except Exception as e:
        return JsonResponse({"error": str(e)})
    

# proto_path = os.path.join(settings.BASE_DIR, "models/deploy.prototxt")
# model_path = os.path.join(settings.BASE_DIR, "models/res10_300x300_ssd_iter_140000.caffemodel")
# net = cv2.dnn.readNetFromCaffe(proto_path, model_path)

# def detect_face(image):
#     h, w = image.shape[:2]
#     blob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 1.0,
#                                 (300, 300), (104.0, 177.0, 123.0))
#     net.setInput(blob)
#     detections = net.forward()

#     if detections.shape[2] == 0:
#         return None

#     confidence = detections[0, 0, 0, 2]
#     if confidence > 0.5:
#         box = detections[0, 0, 0, 3:7] * np.array([w, h, w, h])
#         (x1, y1, x2, y2) = box.astype("int")
#         return image[y1:y2, x1:x2]
#     return None

