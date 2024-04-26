from django.shortcuts import render
from django.http import JsonResponse
import json
from docxtpl import DocxTemplate
from datetime import date, datetime
from django.db.models.functions import ExtractYear
from django.forms.models import model_to_dict
from .models import Proforma as PF
from .models import Item
from .models import DetalleProforma
from .models import Materiales
from .models import PF_Materiales

from django.db.models import Max, Sum

# Create your views here.
def index(request):
    return render(request,"index.html")

def Proforma(request):
    solicitantes = PF.objects.exclude(Solicitante__isnull=True).order_by('Solicitante').values_list('Solicitante', flat=True).distinct()
    lugares = PF.objects.exclude(Lugar__isnull=True).order_by('Lugar').values_list('Lugar', flat=True).distinct()
    max_pf = int(PF.objects.aggregate(max_value=Max('Numero_Proforma'))['max_value'])
    pf_actual = str(max_pf+1) + "-" +str(date.today().year)

    context = {"solicitantes": solicitantes,
               "lugares": lugares,
               "pf_actual":pf_actual}
    return render(request,"proforma/proforma.html", context)

def Generar_Proforma(request):
    if request.method ==  "POST":
        doc = DocxTemplate("..\Integrador\static\docs\Proforma.docx")
        max_pf = int(PF.objects.aggregate(max_value=Max('Numero_Proforma'))['max_value'])
        pf_actual = str(max_pf+1) + "-" +str(date.today().year)
        solicitante = request.POST.get("solicitante")
        lugar = request.POST.get("lugar")
        materiales = json.loads(request.POST.get("materiales"))
        tiempo = request.POST.get("tiempo")
        items_json = request.POST.get("lista_items")
        items = json.loads(items_json)
        fecha = date.today().strftime("%d/%m/%Y")
        anio = date.today().strftime("%Y")

        if tiempo == "1":
            tiempo_txt = str(tiempo) + " día hábil"
        else:
            tiempo_txt = str(tiempo) + " días hábiles"
        total = 0
        for item in items:
            total += round(float(item["precio_total"]),2)
        total = "{:.2f}".format(total)
        filas_extra = []
        extra = 10 - int(len(materiales)) - int(len(items))
        if extra >0:
            for x in range(extra):
                filas_extra.append("")
        fecha_bd = date.today().strftime("%Y-%m-%d")

        # INSERCIÓN
        proforma = PF(Numero_Proforma = (max_pf +1), Solicitante = solicitante, Lugar = lugar, TIEMPO = int(tiempo), Fecha_Creacion = fecha_bd)
        proforma.save()

        for item in items:
            bd_item = Item(Cantidad = item['cantidad'], Descripcion = item['descripcion'], Precio_Unitario = item['precio_uni'], Precio_Total = item['precio_total'])
            bd_item.save()
            detalle_pf = DetalleProforma(IDProforma = proforma, IDItem = bd_item)
            detalle_pf.save()

        for material in materiales:
            bd_materiales = Materiales(Descripcion = material)
            bd_materiales.save()
            detalle_material = PF_Materiales(IDProforma=proforma, IDMateriales = bd_materiales)
            detalle_material.save()

        context = {"solicitante":solicitante,
                   "pf_actual":pf_actual,
                "lugar":lugar,
                "materiales":materiales,
                "items": items,
                "tiempo":tiempo_txt,
                "fecha":fecha,
                "anio":anio,
                "total":total,
                "filas_extra":filas_extra
                }
        doc.render(context)

        #Guardar el documento resultante
        doc.save("PF"+ pf_actual +".docx")

    return JsonResponse({'mensaje': 'Datos recibidos correctamente'})

def Editar_Proforma(request):
    proformas = PF.objects.annotate(
        año_creacion=ExtractYear('Fecha_Creacion')
    ).values('IDProforma', 'Numero_Proforma', 'Fecha_Creacion', 'año_creacion').order_by('-Numero_Proforma')
    solicitantes = PF.objects.exclude(Solicitante__isnull=True).order_by('Solicitante').values_list('Solicitante', flat=True).distinct()
    lugares = PF.objects.exclude(Lugar__isnull=True).order_by('Lugar').values_list('Lugar', flat=True).distinct()
    max_pf = int(PF.objects.aggregate(max_value=Max('Numero_Proforma'))['max_value'])
    pf_actual = str(max_pf+1) + "-" +str(date.today().year)
    
    context = {"solicitantes": solicitantes,
               "lugares": lugares,
               "pf_actual":pf_actual,
               "proformas":proformas}
    return render(request,"proforma/Editar_Proforma.html", context)

def Update_Proforma(request):
    id = request.POST.get("id")
    proformas= model_to_dict(PF.objects.get(IDProforma = id))
    id_material = PF_Materiales.objects.filter(IDProforma = id).values_list('IDMateriales', flat=True)
    materiales = Materiales.objects.filter(IDMateriales__in=id_material).values_list('Descripcion', flat=True)
    id_items = DetalleProforma.objects.filter(IDProforma = id).values_list('IDItem', flat=True)
    item = Item.objects.filter(IDItem__in = id_items).values('Cantidad','Descripcion','Precio_Unitario','Precio_Total')
    Total = Item.objects.filter(IDItem__in = id_items).aggregate(
        sum_total=Sum('Precio_Total')
    )['sum_total']
    proformas_json ={'proformas':proformas}
    materiales_json ={'materiales':list(materiales)}
    items_json ={'item':list(item)}
    total_json ={'total':Total}
    data = {**proformas_json, **materiales_json,**items_json,**total_json}
    
    
    return JsonResponse(data)
