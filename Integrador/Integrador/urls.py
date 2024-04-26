
from django.contrib import admin
from django.urls import path
from Proforma.views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index),
    path('Proforma/', Proforma),
    path("Proforma/Generar_Proforma/", Generar_Proforma, name="Generar_Proforma"),
    path("Editar_Proforma/", Editar_Proforma, name="Listar_Proformas"),
    path("Proforma/Update_Proforma/", Update_Proforma, name="Update_Proforma"),
]
