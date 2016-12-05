from django.conf.urls.defaults import patterns, url
from django.views.generic import TemplateView


__author__ = 'LittleJoe'

urlpatterns = patterns('',
    url(r'^$', 'constructor.views.constructor', name='8bit_constructor'),
    url(r'^constructor/download/$', 'constructor.views.download_masterpiece', name='8bit_download'),
    url(r'^constructor/vk/$', 'constructor.views.set_vk', name='8bit_set_vk'),
    url(r'^constructor/fb/$', 'constructor.views.set_fb', name='8bit_set_fb'),

    url(r'^vk_frame/$', 'constructor.views.vk_frame', name='8bit_vk_frame'),

    (r'^channel\.html$', TemplateView.as_view(template_name='constructor/channel.html'))
)