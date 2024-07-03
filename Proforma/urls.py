from django.urls import path, include
from rest_framework import routers
from Proforma import views

router = routers.DefaultRouter()
router.register(r'proforma', views.Proforma)

urlpatterns =[
    path('', include(router.urls))
]