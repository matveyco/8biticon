import random

from PIL import Image

from django.conf import settings
from django.utils import simplejson


def compose_image(data=None, gender=None):

    #load conf
    conf = open('%s/%s' % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), 'js/8settings.json'))
    conf_data = simplejson.load(conf)
    conf.close()

    if gender == 'm' or gender == 'male':
        gender = 'male'
    elif gender == 'f' or gender == 'female':
        gender = 'female'
    else:
        #make it male anyway :)
        gender = 'male'

    #prepare data
    if data:
        for c in conf_data[gender]:
            if data and not data[c['name']] in range(1, int(c['count']) + 1) :
                data[c['name']] = random.randint(1, int(c['count']) + 1)
    else:
        data = dict()
        for c in conf_data[gender]:
            data[c['name']] = random.randint(1, int(c['count']))

    #create masterpiece
    im_base = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'background', data['background']) )
    im_base = im_base.convert("RGBA")

    im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'face', data['face']) )
    im_base.paste(im, im)

    im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'clothes', data['clothes']) )
    im_base.paste(im, (0,0), im)

    im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'mouth', data['mouth']) )
    im_base.paste(im, (0,0), im)

    if 'hair' in data:
        im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'hair', data['hair']) )
        im_base.paste(im, (0,0), im)

    if 'head' in data:
        im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'head', data['head']) )
        im_base.paste(im, (0,0), im)

    im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'eye', data['eye']) )
    im_base.paste(im, (0,0), im)

    return im_base