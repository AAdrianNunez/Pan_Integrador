from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import json
from docxtpl import DocxTemplate
from docx2pdf import convert
from datetime import date, datetime
from django.db.models.functions import ExtractYear
from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from django.db import models
from django.db.models import Max, Sum
from rest_framework.response import Response
from django.db import connection
import os
from django.conf import settings
# Create your views here.
def index(request):
    return render(request,"index.html")

def NuevaProforma(request):
    return render(request,"proforma/NuevaProforma.html")

def NuevaEmpresa(request):
    return render(request,"Empresa/NuevaEmpresa.html")

def NuevoItem(request):
    return render(request,"Item/NuevoItem.html")


@api_view(['GET'])
def ListarSolicitantes(request):
    with connection.cursor() as cursor:
        cursor.execute('EXEC USPListarSoliciantes')
        resultados = cursor.fetchall()
        data = []
        for row in resultados:
            data.append({
                'Solicitante': row[0],
            })
        print(data)
        connection.close()

    return Response(data)
    
@api_view(['POST'])
def ListarLugares(request):
    with connection.cursor() as cursor:
        cursor.execute('EXEC USPListarLugar')
        resultados = cursor.fetchall()
        data = []
        for row in resultados:
            data.append({
                'Lugar': row[0],
            })
        print(data)
        connection.close()

    return Response(data)  

@api_view(['GET'])
def ListarProforma(request):
    with connection.cursor() as cursor:
        cursor.execute('EXEC USPListarProforma')
        resultados = cursor.fetchall()

        data = []
        for row in resultados:
            data.append({
                'IDProforma':row[0],
                'Numero': row[1],
                'Descripcion': row[2],
                'Empresa': row[3],
                'Solicitante': row[4],
                'Lugar': row[5],
                'FechaCreacion': row[6],
                'PrecioTotal': row[7]
            })
        print(data)

        connection.close()

    return Response(data)

@api_view(['POST'])
def CrearProforma(request):
    solicitante = request.data.get('solicitante')
    lugar = request.data.get('lugar')
    idempresa = request.data.get('idempresa')
    
    items_json = request.data.get('items')
    items = json.loads(items_json)
    
    material_json = request.data.get('material')
    material = json.loads(material_json)

    herramienta_json = request.data.get('herramienta')
    herramienta = json.loads(herramienta_json)

    tiempo = request.data.get('tiempo')

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                EXEC USPCrearProforma @IDEmpresa=%s, @Solicitante=%s, @Lugar=%s, @Items=%s, @Material=%s, @Herramienta=%s, @Tiempo=%s
                """,
                [idempresa, solicitante, lugar, json.dumps(items), json.dumps(material), json.dumps(herramienta), tiempo]
            )
            result = cursor.fetchall()
            numero = result[0][0]
            doc = DocxTemplate("..\Integrador\static\docs\Proforma.docx")
            context = {
                        "solicitante":solicitante,
                        "numero":numero,
                        "lugar":lugar,
                        "items": items,
                        "materiales":material,
                        "herramientas": herramienta,
                        "tiempo":tiempo,
                        "fecha": date.today().strftime("%d/%m/%Y"),
                        "total":items[0][3],
                    }
            doc.render(context)

            #Guardar el documento resultante
            word_file_name = f"PF{numero}.docx"
            pdf_file_name = f"PF{numero}.pdf"
            word_file_path = os.path.join(settings.MEDIA_ROOT, word_file_name)
            pdf_file_path = os.path.join(settings.MEDIA_ROOT, pdf_file_name)

            doc.save(word_file_path)
            convert(word_file_path, pdf_file_path)
            return JsonResponse({'filename': pdf_file_name})
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=500)


### PROFORMA NUEVA EN BASE A ANTERIOR
@api_view(['POST'])
def ProformaPorID(request):
    idproforma = request.data.get('IDProforma')

    try:
        with connection.cursor() as cursor:
                cursor.execute("""
                    EXEC USPProformaPorID @IDProforma=%s
                    """,
                    [idproforma]
                )
                resultados = cursor.fetchall()
                data = []
                for row in resultados:
                    data.append({
                        'Solicitante': row[0],
                        'Lugar': row[1],
                        'Tiempo': row[2],
                        'IDEmpresa': row[3]
                    })
                connection.close()
    except Exception as e:
        print(e)

    return Response(data)  

@api_view(['POST'])
def ObtenerItems(request):
    idproforma = request.data.get('IDProforma')

    try:
        with connection.cursor() as cursor:
                cursor.execute("""
                    EXEC USPItemPorProforma @IDProforma=%s
                    """,
                    [idproforma]
                )
                resultados = cursor.fetchall()
                data = []
                for row in resultados:
                    data.append({
                        'Cantidad': row[0],
                        'Descripcion': row[1],
                        'PU': row[2],
                        'PT': row[3]
                    })
                connection.close()
    except Exception as e:
        print(e)

    return Response(data)  

@api_view(['POST'])
def ObtenerMateriales(request):
    idproforma = request.data.get('IDProforma')

    try:
        with connection.cursor() as cursor:
                cursor.execute("""
                    EXEC USPMaterialPorProforma @IDProforma=%s
                    """,
                    [idproforma]
                )
                resultados = cursor.fetchall()
                data = []
                for row in resultados:
                    data.append({
                        'Descripcion': row[0],
                    })
                connection.close()
    except Exception as e:
        print(e)

    return Response(data)  

@api_view(['POST'])
def ObtenerHerramientas(request):
    idproforma = request.data.get('IDProforma')

    try:
        with connection.cursor() as cursor:
                cursor.execute("""
                    EXEC USPHerramientaPorProforma @IDProforma=%s
                    """,
                    [idproforma]
                )
                resultados = cursor.fetchall()
                data = []
                for row in resultados:
                    data.append({
                        'Descripcion': row[0],
                    })
                connection.close()
    except Exception as e:
        print(e)

    return Response(data)  