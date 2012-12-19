import socket
origGetAddrInfo = socket.getaddrinfo

def getAddrInfoWrapper(host, port, family=0, socktype=0, proto=0, flags=0):
    return origGetAddrInfo(host, port, socket.AF_INET, socktype, proto, flags)

# replace the original socket.getaddrinfo by our version
socket.getaddrinfo = getAddrInfoWrapper


import mimetypes
import os
import urllib
import urllib2
import uuid
import facebook
from poster.encode import multipart_encode
from poster.streaminghttp import register_openers

from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.utils import simplejson
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from constructor.utils import compose_image


__author__ = 'LittleJoe'

def constructor(request):
    return render_to_response('constructor/constructor.html',
        {'VK_APP_ID': settings.VK_APP_ID,
         'FB_APP_ID': settings.FB_APP_ID},
        context_instance=RequestContext(request))

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


@never_cache
def set_vk(request):
    upload_url = request.POST.get('upload_url')

    if upload_url:
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

        register_openers()
        datagen, headers = multipart_encode({"photo": open(image_path, "rb")})

        # Create the Request object
        request = urllib2.Request(upload_url, datagen, headers)
        # Actually do the request, and get the response
        response = urllib2.urlopen(request).read()
        return HttpResponse(response)

    return HttpResponseBadRequest()

@never_cache
def set_fb(request):

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

        access_token = request.POST.get('token')

        if not access_token:
            user = facebook.get_user_from_cookie(request.COOKIES, settings.FB_APP_ID, settings.FB_APP_SECRET)
            access_token = user["access_token"]

        if access_token:
            graph = facebook.GraphAPI(access_token)
            response = graph.put_photo(open(image_path))
            return HttpResponse(simplejson.dumps(response))
        return HttpResponseBadRequest()


def vk_frame(request):
    return render_to_response('constructor/iframe.html',
            {'VK_APP_ID': settings.VK_APP_ID},
            context_instance=RequestContext(request))