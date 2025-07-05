from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image

class Worker(models.Model):
    name = models.CharField(max_length=100)
    worker_id = models.CharField(max_length=10, unique=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)

    def __str__(self):
        return f"{self.name} ({self.worker_id})"

    def save(self, *args, **kwargs):  # ✅ INSIDE the class now
        if not self.qr_code:
            import qrcode
            from io import BytesIO
            from django.core.files import File

            # Encode both worker_id and name
            qr_data = f"{self.worker_id}|{self.name}"
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(qr_data)
            qr.make(fit=True)
            img = qr.make_image(fill='black', back_color='white')

            blob = BytesIO()
            img.save(blob, 'PNG')
            self.qr_code.save(f'{self.worker_id}_qr.png', File(blob), save=False)
            print(f"Generating QR for: {self.worker_id}|{self.name}")

        super().save(*args, **kwargs)
