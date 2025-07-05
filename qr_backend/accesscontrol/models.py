from django.db import models

# Create your models here.

import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image, ImageDraw
from django.utils import timezone
from django.core.files.base import ContentFile
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from django.conf import settings
import os
from datetime import date
from django.utils.timezone import now
import cv2
from django.db import models
import numpy as np
from .face_utils import generate_dlib_embedding

class Worker(models.Model):
    name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100, default='N/A')
    age = models.IntegerField(default=0)
    address = models.TextField(default='N/A')
    police_station = models.CharField(max_length=100, default='N/A')
    identification_marks = models.TextField(default='N/A')
    purpose = models.CharField(max_length=100, default='N/A')
    photo = models.ImageField(upload_to='worker_photos/', null=True, blank=True)
    employee_id = models.CharField(max_length=50, unique=True)
    entry_start_date = models.DateField(default=date.today)
    entry_end_date = models.DateField(default=date.today)
    designation = models.CharField(max_length=40,default='N/A')
    mob_no = models.CharField(max_length=15, default='N/A')
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)
    pass_pdf = models.FileField(upload_to='entry_passes/', null=True, blank=True)

    def save(self, *args, **kwargs):
        # Step 1: Generate employee ID
        if not self.employee_id:
            last_worker = Worker.objects.order_by('-id').first()
            next_id = f"EMP{(last_worker.id + 1 if last_worker else 1):03d}"
            self.employee_id = next_id

        # Step 2: Generate QR code
        qr_data = f"{self.employee_id}|{self.name}"
        qr_img = qrcode.make(qr_data)
        blob = BytesIO()
        qr_img.save(blob, format='PNG')

        if self.qr_code:
            try:
                if os.path.isfile(self.qr_code.path):
                    os.remove(self.qr_code.path)
            except Exception as e:
                print(f"[WARNING] Failed to delete old QR code: {e}")

        self.qr_code.save(f'{self.employee_id}_qr.png', ContentFile(blob.getvalue()), save=False)

        # Step 3: Save to access photo path
        super().save(*args, **kwargs)

        # Step 4: Generate deep face encoding
        if self.photo:
            generate_dlib_embedding(self.photo.path, self.employee_id)

        # Step 5: Generate entry pass PDF
        generate_entry_pass(self)
        super().save(update_fields=['pass_pdf'])

    def __str__(self):
        return f"{self.name} ({self.employee_id})"


class CheckIn(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.worker.name} - {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"
    

class AttendanceLog(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=10, choices=[('IN', 'Check-In'), ('OUT', 'Check-Out')])

    def __str__(self):
        return f"{self.worker.name} - {self.status} at {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"
    

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A6
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from io import BytesIO
from django.core.files.base import ContentFile
from django.utils.timezone import now
import os
from django.conf import settings

def generate_entry_pass(worker):
    buffer = BytesIO()
    width, height = landscape(A6)
    c = canvas.Canvas(buffer, pagesize=(width, height))

    # Draw top banner (orange) - made slightly taller for better proportion
    c.setFillColorRGB(1, 0.5, 0)
    c.rect(0, height - 65, width, 55, fill=1, stroke=0)

    # Draw IOCL logo - positioned better within the banner
    logo_path = os.path.join(settings.BASE_DIR, 'static/images/indianoil_logo.png')
    if os.path.exists(logo_path):
        c.drawImage(logo_path, 8 * mm, height - 22 * mm, width=20 * mm, height=16 * mm, preserveAspectRatio=True, mask='auto')

    # Title next to logo - better positioned and sized
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(32 * mm, height - 10 * mm, "Indian Oil Corporation Limited")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(32 * mm, height - 15 * mm, "Guwahati Refinery")
    c.setFont("Helvetica", 8)
    c.drawString(32 * mm, height - 20 * mm, "Employee Identification Card")

    # Back to black for the rest
    c.setFillColorRGB(0, 0, 0)

    # Photo - better positioned and proportioned
    photo_w, photo_h = 28 * mm, 35 * mm
    photo_x, photo_y = 12 * mm, height - 65 * mm
    
    # Add a subtle border around photo
    c.setStrokeColorRGB(0.8, 0.8, 0.8)
    c.setLineWidth(1)
    c.rect(photo_x - 1, photo_y - 1, photo_w + 2, photo_h + 2, fill=0, stroke=1)
    
    if worker.photo and os.path.exists(worker.photo.path):
        c.drawImage(worker.photo.path, photo_x, photo_y, width=photo_w, height=photo_h, preserveAspectRatio=True, mask='auto')
    else:
        c.setFillColorRGB(0.95, 0.95, 0.95)
        c.rect(photo_x, photo_y, photo_w, photo_h, fill=1)
        c.setFillColorRGB(0.6, 0.6, 0.6)
        c.setFont("Helvetica", 8)
        c.drawCentredText(photo_x + photo_w/2, photo_y + photo_h/2, "PHOTO")

    # Text details - better spacing and alignment
    text_x = photo_x + photo_w + 15 * mm
    y = height - 35 * mm
    line_gap = 8 * mm

    # Make labels bold and values on same line
    info = [
        ("Name", worker.name),
        ("Designation", worker.designation),
        ("Mobile No", worker.mob_no),
        ("Employee ID", worker.employee_id),
    ]

    c.setFillColorRGB(0, 0, 0)
    for label, value in info:
        # Label in bold with value on same line
        c.setFont("Helvetica-Bold", 9)
        c.drawString(text_x, y, f"{label}: {str(value)}")
        y -= line_gap

    # Signature line - better positioned and labeled
    sig_y = y - 15
    c.setStrokeColorRGB(0, 0, 0)
    c.setLineWidth(0.5)
    c.line(text_x, sig_y, text_x + 45 * mm, sig_y)
    c.setFont("Helvetica", 7)
    c.drawString(text_x, sig_y - 8, "Authorized Signature")

    # QR code at bottom-right - better positioned
    qr_size = 28 * mm
    qr_x = width - qr_size - 8 * mm
    qr_y = 8 * mm
    
    if worker.qr_code and os.path.exists(worker.qr_code.path):
        c.drawImage(worker.qr_code.path, qr_x, qr_y, width=qr_size, height=qr_size, preserveAspectRatio=True, mask='auto')
    else:
        # QR code placeholder with border
        c.setStrokeColorRGB(0.8, 0.8, 0.8)
        c.setLineWidth(1)
        c.rect(qr_x, qr_y, qr_size, qr_size, fill=0, stroke=1)
        c.setFont("Helvetica", 6)
        c.drawCentredText(qr_x + qr_size/2, qr_y + qr_size/2, "QR CODE")

    # Add issue date at bottom left
    c.setFont("Helvetica", 7)
    c.setFillColorRGB(0.4, 0.4, 0.4)
    issue_date = now().strftime("%d/%m/%Y")
    c.drawString(12 * mm, 5 * mm, f"Issue Date: {issue_date}")

    # Add a subtle border around the entire card
    c.setStrokeColorRGB(1, 0.5, 0)  # IOCL orange
    c.setLineWidth(2)
    c.rect(5, 5, width - 10, height - 10, fill=0, stroke=1)

    c.save()
    buffer.seek(0)

    # Save PDF to model
    timestamp = now().strftime("%Y%m%d_%H%M")
    file_name = f"{worker.employee_id}_entry_id_card_{timestamp}.pdf"
    worker.pass_pdf.save(file_name, ContentFile(buffer.read()), save=False)