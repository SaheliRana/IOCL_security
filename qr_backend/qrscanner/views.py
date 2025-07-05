from django.shortcuts import render

# Create your views here.
from accesscontrol.models import AttendanceLog
from django.db.models import Max

def get_currently_inside_count():
    latest_logs = AttendanceLog.objects.values('worker').annotate(latest=Max('timestamp'))
    count = 0
    for log in latest_logs:
        latest = AttendanceLog.objects.filter(worker=log['worker'], timestamp=log['latest']).first()
        if latest.status == 'IN':
            count += 1
    return count

