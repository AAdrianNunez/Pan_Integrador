from rest_framework.decorators import api_view
from .serializers import CrearEmpresaSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import connection


# Create your views here.
# class EmpresaViewSet(viewsets.ModelViewSet):
#     queryset = Empresa.objects.all()
#     serializer_class = EmpresaSerializer

@api_view(['POST'])
def listar_empresa(request):
    with connection.cursor() as cursor:
        # query = """SELECT IDEmpresa, Nombre FROM Empresa """
        cursor.execute('EXEC USPListarEmpresas')
        resultados = cursor.fetchall()

        data = []
        for row in resultados:
            data.append({
                'IDEmpresa': row[0],
                'Nombre': row[1],
                'Ruc': row[2],
                'Direccion': row[3]
            })
        print(data)
    return Response(data)

@api_view(['POST'])
def registrar_empresa(request):
    serializer = CrearEmpresaSerializer(data=request.data)
    print(serializer)

    if serializer.is_valid():
        Nombre = serializer.validated_data['Nombre']
        Ruc = serializer.validated_data['Ruc']
        Direccion = serializer.validated_data['Direccion']

        with connection.cursor() as cursor:
            cursor.execute(
                "EXEC USPRegistrarEmpresa @Nombre = %s, @Ruc = %s, @Direccion = %s",
                [Nombre, Ruc, Direccion]
                )
            retval = 1
        return Response({"message": "Empresa registrada correctamente.", "retval": retval}, status=status.HTTP_201_CREATED)
    else:
        return Response({"message": "No se pudo registrar la empresa."}, status=status.HTTP_400_BAD_REQUEST)