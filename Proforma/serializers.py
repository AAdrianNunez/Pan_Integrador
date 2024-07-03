from rest_framework import serializers
from .models import *


class listarProforma(serializers.Serializer):
    class Meta:
        model = Proforma
        fields = ('Numero', 'Solicitante', 'Lugar', 'Tiempo', 'FechaCreacion', 'Estado')

class CrearProformaSerializar(serializers.ModelSerializer):
    class Meta:
        model = Proforma
        fields = ('Numero', 'Solicitante', 'Lugar', 'Tiempo', 'FechaCreacion', 'Estado')