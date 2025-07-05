from django.contrib import admin

# Register your models here.
from .models import Worker, AttendanceLog
from django.urls import path
from django.http import HttpResponseRedirect

class WorkerAdmin(admin.ModelAdmin):
    readonly_fields = ('qr_code', 'pass_pdf','employee_id')
    fieldsets = (
        ('Personal Details', {
            'fields': ('name', 'father_name', 'age', 'photo','mob_no')
        }),
        ('Identification & Purpose', {
            'fields': ('address', 'police_station', 'identification_marks', 'purpose')
        }),
        ('Work Info', {
            'fields': ('entry_start_date', 'entry_end_date','designation')
        }),
        ('Auto-Generated', {
            'fields': ('qr_code', 'pass_pdf')
        }),
    )

class AttendanceLogAdmin(admin.ModelAdmin):
    list_display = ('worker', 'status', 'timestamp')
    list_filter = ('status', 'timestamp')
    search_fields = ('worker__name', 'worker__employee_id')
    ordering = ('-timestamp',)

admin.site.register(Worker, WorkerAdmin)
admin.site.register(AttendanceLog, AttendanceLogAdmin)
