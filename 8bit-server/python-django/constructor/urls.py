from django.conf.urls.defaults import patterns, url
from django.views.generic import TemplateView

urlpatterns = patterns('',
    url(r'^constructor/$', TemplateView.as_view(template_name='constructor/constructor.html'), name='8bit_constructor'),
    url(r'^constructor/download/$', 'constructor.views.download_masterpiece', name='8bit_download'),
)