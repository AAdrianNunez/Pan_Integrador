from rest_framework import serializers
from .models import *

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'

class CrearEmpresaSerializer(serializers.Serializer):
    Nombre = serializers.CharField(max_length = 150)
    Ruc = serializers.CharField(max_length=11)
    Direccion = serializers.CharField(max_length=150)