"""db URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.views.generic import RedirectView
from rest_framework import routers
from venue_reg import views

urlpatterns = [
    path('', views.index, name='index'),
    url(r'^admin/', admin.site.urls),
    url(r'^login/', views.Login.as_view()),
    url(r'^getVenues/', views.GetVenues.as_view()),
    url(r'^getMyRecords/', views.GetMyRecords.as_view()),
    url(r'^getDayRecords/', views.GetDayRecords.as_view()),
    url(r'^insertRecord/', views.InsertRecord.as_view()),
    url(r'^lazyDelete/', views.LazyDelete.as_view()),
    url(r'^hoursAWeek/', views.HoursAWeek.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
