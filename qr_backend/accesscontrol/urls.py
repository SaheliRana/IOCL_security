# accesscontrol/urls.py

from django.urls import path
from . import views
from .views import overtime_alert_view
from .views import export_attendance_csv
from .views import run_qr_scanner
urlpatterns = [
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('overtime-alerts/', overtime_alert_view, name='overtime_alerts'),
    path('export-csv/', export_attendance_csv, name='export_csv'),
    path('export-currently-inside/', views.export_currently_inside_csv, name='export_currently_inside'),
    path("api/dashboard-data/", views.dashboard_data_view, name="dashboard_data"),
    path("api/overtime-alerts-data/", views.overtime_alert_data_view, name="overtime_alert_data"),
    path('run-qr-scanner/', run_qr_scanner, name='run_qr_scanner'),
]
