import random
import numpy as np
from PIL import Image, ImageFont, ImageDraw

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

    if data:
        for c in conf_data[gender]:
            if data and not data[c['name']] in range(1, int(c['count']) + 1) :
                data[c['name']] = random.randint(1, int(c['count']) + 1)
    else:
        data = dict()
        for c in conf_data[gender]:
            data[c['name']] = random.randint(1, int(c['count']))

    im_base = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'background', data['background']) )
    im_base = im_base.convert("RGBA")

    im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'face', data['face']) )
    #im_base.paste(im, im)
    #im_base = alpha_composite(im_base, im)
    im_base = alpha_composite2(im, im_base)

    im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'clothes', data['clothes']) )
    #im_base.paste(im, (0,0), im)
    im_base = alpha_composite2(im, im_base)

    im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'mouth', data['mouth']) )
    #im_base.paste(im, (0,0), im)
    im_base = alpha_composite2(im, im_base)

    if 'hair' in data:
        im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'hair', data['hair']) )
        #im_base.paste(im, (0,0), im)
        im_base = alpha_composite2(im, im_base)

    if 'head' in data:
        im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'head', data['head']) )
        #im_base.paste(im, (0,0), im)
        im_base = alpha_composite2(im, im_base)

    im = Image.open("%s/img/%s/%s%s.png" % (settings.EIGHT_BIT_DATA_PATH.rstrip('/'), gender, 'eye', data['eye']) )
    #im_base.paste(im, (0,0), im)
    im_base = alpha_composite2(im, im_base)


    font = ImageFont.truetype(settings.FONT_PATH, 8)
    draw = ImageDraw.Draw(im_base)
    draw.rectangle([0, 388, 400, 400], "#ffffff", "#ffffff")
    draw.text((300, 389),"made by 8biticon.com",(99,99,99),font=font)

    return im_base


def alpha_composite(dst, src):
    # get alphachanels
    src_a = src.convert('RGBA').split()[-1]
    dst_a = dst.convert('RGBA').split()[-1]

    new_alpha = list(dst_a.getdata())
    new_blending = list(src_a.getdata())

    for i in xrange(len(new_alpha)):
        alpha_pixel = new_blending[i]
        if alpha_pixel == 0:
            new_alpha[i] = 0
        else:
            new_alpha[i] = alpha_pixel + (255 - alpha_pixel) * new_alpha[i] / 255
            new_blending[i] = alpha_pixel * 255 / new_alpha[i]

    alpha.putdata(new_alpha)
    background_alpha.putdata(new_blending)

    del new_alpha
    del new_blending

    result = background.copy()

    result.paste(image, (0, 0), background_alpha)
    result.putalpha(alpha)

    return result

def alpha_composite2(src, dst):
    '''
    Return the alpha composite of src and dst.

    Parameters:
    src -- PIL RGBA Image object
    dst -- PIL RGBA Image object

    The algorithm comes from http://en.wikipedia.org/wiki/Alpha_compositing
    '''
    # http://stackoverflow.com/a/3375291/190597
    # http://stackoverflow.com/a/9166671/190597
    src = np.asarray(src)
    dst = np.asarray(dst)
    out = np.empty(src.shape, dtype = 'float')
    alpha = np.index_exp[:, :, 3:]
    rgb = np.index_exp[:, :, :3]
    src_a = src[alpha]/255.0
    dst_a = dst[alpha]/255.0
    out[alpha] = src_a+dst_a*(1-src_a)
    old_setting = np.seterr(invalid = 'ignore')
    out[rgb] = (src[rgb]*src_a + dst[rgb]*dst_a*(1-src_a))/out[alpha]
    np.seterr(**old_setting)
    out[alpha] *= 255
    np.clip(out,0,255)
    # astype('uint8') maps np.nan (and np.inf) to 0
    out = out.astype('uint8')
    out = Image.fromarray(out, 'RGBA')
    return out