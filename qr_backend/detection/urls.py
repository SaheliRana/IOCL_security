# detection/urls.py

from django.urls import path

from .views import upload_video, stream_feed, live_page

urlpatterns = [
    path('detect/', upload_video, name='upload_video'),
    path('live/', live_page, name='live_page'),           # Fullscreen HTML page
    path('stream_feed/', stream_feed, name='stream_feed') # Raw MJPEG stream
]