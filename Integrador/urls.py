
from django.contrib import admin
from django.urls import path, include
from Proforma.views import *
from Empresa.views import *
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index),
    path('NuevaProforma/', NuevaProforma, name="NuevaProforma"),
    
    ### API
    path('Home/NuevaEmpresa/', NuevaEmpresa, name="NuevaEmpresa"), #Modal Empresa
    path('Home/NuevoItem/', NuevoItem, name="NuevoItem"), #Modal Item
    path('Home/ListarEmpresa/', listar_empresa, name="listar_empresa"),
    path('Home/ListarSolicitantes/', ListarSolicitantes, name="ListarSolicitantes"),
    path('Home/ListarLugares/', ListarLugares, name="ListarLugares"),
    path('Home/RegistrarEmpresa/', registrar_empresa, name="registrar_empresa"),
    path("Home/CrearProforma/", CrearProforma, name="CrearProforma"),
    path("Home/ListarProforma/", ListarProforma, name="ListarProforma"),
    path("Home/ProformaPorID/", ProformaPorID, name="ProformaPorID"),
    path("Home/ObtenerItems/", ObtenerItems, name="ObtenerItems"),
    path("Home/ObtenerMateriales/", ObtenerMateriales, name="ObtenerMateriales"),
    path("Home/ObtenerHerramientas/", ObtenerHerramientas, name="ObtenerHerramientas"),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)