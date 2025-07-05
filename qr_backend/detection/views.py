from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
from django.core.files.storage import default_storage
import os
from .yolo_utils import process_video, process_live_feed  # ✅ only these
from django.views.decorators import gzip
from django.http import StreamingHttpResponse

@api_view(['POST'])
def upload_video(request):
    video_file = request.FILES.get('video')
    model_key = request.POST.get('model_type')

    if not video_file or not model_key:
        return Response({'error': 'Missing video or model key'}, status=400)

    original_name = os.path.splitext(video_file.name)[0]
    safe_name = ''.join(e for e in original_name if e.isalnum() or e in ('_', '-'))

    filename = f"{safe_name}_{model_key}_input.mp4"
    temp_path = os.path.join('temp', filename)
    full_path = os.path.join(settings.MEDIA_ROOT, temp_path)

    with default_storage.open(temp_path, 'wb+') as dest:
        for chunk in video_file.chunks():
            dest.write(chunk)

    try:
        result_path = process_video(full_path, model_key)
    except ValueError as e:
        return Response({'error': str(e)}, status=400)

    result_url = os.path.relpath(result_path, settings.MEDIA_ROOT)
    return Response({'result_url': f'/media/{result_url}'})

@gzip.gzip_page
@api_view(['GET'])
def stream_feed(request):
    model_key = request.GET.get('model_type')
    if not model_key:
        return Response({'error': 'Model type not provided'}, status=400)

    return StreamingHttpResponse(
        process_live_feed(model_key),
        content_type='multipart/x-mixed-replace; boundary=frame'
    )

from django.shortcuts import render

@api_view(['GET'])
def live_page(request):
    model_key = request.GET.get('model_type', 'helmet')
    return render(request, 'live_stream.html', {'model_type': model_key})
