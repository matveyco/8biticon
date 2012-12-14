import mimetypes
import os
import urllib
import uuid

from django.conf import settings
from django.http import HttpResponse
from django.utils import simplejson
from django.views.decorators.csrf import csrf_protect
from constructor.utils import compose_image


@csrf_protect
def download_masterpiece(request):
    data = request.POST.get('data')

    try:
        data = simplejson.loads(data)
    except ValueError:
        data = None

    gender = request.POST.get('gender')
    image = compose_image(data, gender)

    image_filename = "%s.%s" % (str(uuid.uuid4()), 'png')
    image_path = "%s/%s" % (settings.MEDIA_ROOT, image_filename)
    image.save(image_path)

    file = open(image_path, 'rb')

    original_filename = 'picture.png'
    type, encoding = mimetypes.guess_type(image_path)
    response = HttpResponse(file.read())

    if type is None:
        type = 'application/octet-stream'
    response['Content-Type'] = type
    response['Content-Length'] = str(os.path.getsize(image_path))
    if encoding is not None:
        response['Content-Encoding'] = encoding

    # To inspect details for the below code, see http://greenbytes.de/tech/tc2231/
    if u'WebKit' in request.META['HTTP_USER_AGENT']:
        # Safari 3.0 and Chrome 2.0 accepts UTF-8 encoded string directly.
        filename_header = 'filename=%s' % original_filename.encode('utf-8')
    elif u'MSIE' in request.META['HTTP_USER_AGENT']:
        # IE does not support internationalized filename at all.
        # It can only recognize internationalized URL, so we do the trick via routing rules.
        filename_header = ''
    else:
        # For others like Firefox, we follow RFC2231 (encoding extension in HTTP headers).
        filename_header = 'filename*=UTF-8\'\'%s' % urllib.quote(original_filename.encode('utf-8'))
    response['Content-Disposition'] = 'attachment; ' + filename_header

    file.close()
    return response