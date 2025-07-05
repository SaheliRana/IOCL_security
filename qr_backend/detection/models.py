from django.db import models

class DetectionLog(models.Model):
    worker_id = models.CharField(max_length=50, blank=True)
    label = models.CharField(max_length=50)
    confidence = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    frame_path = models.ImageField(upload_to='detection_logs/', null=True, blank=True)

    def __str__(self):
        return f"{self.worker_id} - {self.label} ({self.confidence:.2f})"
