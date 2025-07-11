# Generated by Django 5.2.3 on 2025-06-11 21:58

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accesscontrol', '0002_checkin'),
    ]

    operations = [
        migrations.CreateModel(
            name='AttendanceLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('status', models.CharField(choices=[('IN', 'Check-In'), ('OUT', 'Check-Out')], max_length=10)),
                ('worker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accesscontrol.worker')),
            ],
        ),
    ]
