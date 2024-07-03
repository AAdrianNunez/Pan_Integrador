var globalList = "";
const csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
var filename = ""

$(document).ready(function () {
    const date = new Date();
    const urlParams = new URLSearchParams(window.location.search);
    const proforma = urlParams.get('id');
    ListarEmpresas();
    // ListarLugar();
    if(proforma!=null){
        ObtenerProforma(proforma);
        ObtenerItems(proforma);
        ObtenerMateriales(proforma);
        ObtenerHerramientas(proforma);
    }
    $('#txtFecha').val(date.toLocaleDateString('es-ES'));
});
var txtruc;
var txtdireccion;
function ListarEmpresas() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Home/ListarEmpresa/",
        dataType: "json",
        async: true,
        cache: false,
        success: function (List) {
            if (List.length > 0) {
                globalList = List;
                LlenarEmpresas(List);
            } else {
                alert("No se encontraron registros");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Ocurrió un error");
            return false;
        }
    });
}

function LlenarEmpresas(List){
    let html = "<option value='0'> Seleccionar</option>";
    for (i = 0; i < List.length; i++) {
        html += "<option value='" + List[i].IDEmpresa + "'>"+ List[i].Nombre +"</option>";
        
    }
    $("#selectEmpresa").empty();
    $("#selectEmpresa").append(html);   
}

$('#selectEmpresa').change(function (){
    let val = parseInt($(this).val());
    if (val == 0){
        $('#txtRuc').val('');
        $('#txtDireccion').val('');
        let html = "<option value='0'> Seleccionar</option>";
        $("#selectSolicitante").empty();
        $("#selectSolicitante").append(html);   
    } else{
        let empresa = globalList.find(f => f.IDEmpresa == val); 
        $('#txtRuc').val(empresa.Ruc);
        $('#txtDireccion').val(empresa.Direccion);
        ListarSolicitantes(val);
        ListarLugar(val)
    }
});

function ListarSolicitantes(IDEmpresa) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Home/ListarSolicitantes/",
        data: { IDEmpresa: IDEmpresa},
        dataType: "json",
        async: true,
        cache: false,
        success: function (List) {
            if (List.length > 0) {
                globalList = List;
                LlenarSolicitantes(List);
            } else {
                alert("No se encontraron registros");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Ocurrió un error");
            return false;
        }
    });
}
function LlenarSolicitantes(List){
    let html = "<option value='0'> Seleccionar</option>";
    for (i = 0; i < List.length; i++) {
        html += "<option value='" + List[i].Solicitante + "'>"+ List[i].Solicitante +"</option>";
    }
    $("#selectSolicitante").empty();
    $("#selectSolicitante").append(html);   
}

function ListarLugar(IDEmpresa) {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Home/ListarLugares/",
        dataType: "json",
        data: { IDEmpresa: IDEmpresa},
        async: true,
        cache: false,
        success: function (List) {
            if (List.length > 0) {
                globalList = List;
                LlenarLugares(List);
            } else {
                alert("No se encontraron registros");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Ocurrió un error");
            return false;
        }
    });
}
function LlenarLugares(List){
    let html = "<option value='0'> Seleccionar</option>";
    for (i = 0; i < List.length; i++) {
        html += "<option value='" + List[i].Lugar + "'>"+ List[i].Lugar +"</option>";
    }
    $("#selectLugar").empty();
    $("#selectLugar").append(html);   
}
function ObtenerProforma(IDProforma){
    $.ajax({
        type: "POST",
        url: "/Home/ProformaPorID/",
        dataType: 'json',
        async: true,
        cache: false,
        data: {IDProforma: IDProforma},
        success: function (data) {
            $('#selectEmpresa').val(data[0].IDEmpresa);
            ListarSolicitantes(data[0].IDEmpresa)
            $('#selectSolicitante').val(data[0].Solicitante);
            $('#selectLugar').val(data[0].Lugar);
            $('#txtTiempo').val(data[0].Tiempo);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Ocurrió un error");
            return false;
        }
    });
}
function ObtenerItems(IDProforma){
    $.ajax({
        type: "POST",
        url: "/Home/ObtenerItems/",
        dataType: 'json',
        async: true,
        cache: false,
        data: {IDProforma: IDProforma},
        success: function (data) {
            let html = "";
           
            for (let i = 0; i < data.length;i++ ){
                console.log(i)
                html += "<tr>";
                html += "<td>"+ data[i].Cantidad + "</td>";
                html += "<td>"+ data[i].Descripcion + "</td>";
                html += "<td>" + data[i].PU + "</td>";
                html += "<td>" + data[i].PT + "</td>";
                html += "<td>";
                html += "<button class='btn deleteButton btn-danger btn-sm btn-danger'><i class='fa fa-trash'></i></button>";
                html += "<button class='btn editbutton btn-sm btn-warning' onclick= 'Editar("+ 1 +")';'><i class='fa fa-pencil'></i></button>";
                html += "</td>";
                html += "</tr>";
            }
            $('#ItemBody').append(html);

            $('#ItemBody').on('click', '.deleteButton', function() {
                $(this).closest('tr').remove();
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Ocurrió un error");
            return false;
        }
    });
}
function ObtenerMateriales(IDProforma){
    $.ajax({
        type: "POST",
        url: "/Home/ObtenerMateriales/",
        dataType: 'json',
        async: true,
        cache: false,
        data: {IDProforma: IDProforma},
        success: function (data) {
            let html = "";
            for (i = 0; i< data.length; i++){
                html = "<tr>";
                html += "<td>"+ data[i].Descripcion + "</td>";
                html += "<td>";
                html += "<button class='btn borrarMaterial btn-danger btn-sm btn-danger'><i class='fa fa-trash'></i></button>";
                html += "</td>";
                html += "</tr>";
            }
            $('#MaterialBody').append(html);

            $('#MaterialBody').on('click', '.borrarMaterial', function() {
                $(this).closest('tr').remove();
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Ocurrió un error");
            return false;
        }
    });
}
function ObtenerHerramientas(IDProforma){
    $.ajax({
        type: "POST",
        url: "/Home/ObtenerHerramientas/",
        dataType: 'json',
        async: true,
        cache: false,
        data: {IDProforma: IDProforma},
        success: function (data) {
            let html = "";
            for (i = 0; i< data.length; i++){
                html = "<tr>";
                html += "<td>"+ data[i].Descripcion + "</td>";
                html += "<td>";
                html += "<button class='btn borrarHerramienta btn-danger btn-sm btn-danger'><i class='fa fa-trash'></i></button>";
                html += "</td>";
                html += "</tr>";
            }
            $('#HerramientaBody').append(html);

            $('#HerramientaBody').on('click', '.borrarHerramienta', function() {
                $(this).closest('tr').remove();
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Ocurrió un error");
            return false;
        }
    });
}
$("#btnItem").click(function () {
    Entity = "";
    ModalItem();
});

function ModalItem(){
    $.ajax({
        type: "GET",
        url: "/Home/NuevoItem/",
        cache: false,
        beforeSend: function () {
            $("#divModalItem").empty();
        },
        success: function (data) {
            $("#divModalItem").html(data);
            $("#divModalItem").modal('show');

        }
    });
}


$("#btnNuevo").click(function () {
    Entity = "";
    ModalEmpresa();
});
function Editar(IDItem) {
    var object = {
        IDItem: IDItem
    }
    Entity = object;
    ModalItem();
}
function ModalEmpresa() {
    $.ajax({
        type: "GET",
        url: "/Home/NuevaEmpresa/",
        cache: false,
        beforeSend: function () {
            $("#divModalEmpresa").empty();
        },
        success: function (data) {
            $("#divModalEmpresa").html(data);
            $("#divModalEmpresa").modal('show');

        }
    });
}
$("#btnMaterial").click(function () {
    if ($("#txtMaterial").val().trim() == "") {
        Swal.fire({
            icon: "error",
            text: "Debe ingresar un Material",
          });
        return false;
    }
    AgregarMaterial();
});

function AgregarMaterial() {
    let Material = $("#txtMaterial").val().trim();
    
    let html = "<tr>";
        html += "<td>"+ Material + "</td>";
        html += "<td>";
        html += "<button class='btn borrarMaterial btn-danger btn-sm btn-danger'><i class='fa fa-trash'></i></button>";
        html += "</td>";
        html += "</tr>";

    $('#MaterialBody').append(html);

    $('#MaterialBody').on('click', '.borrarMaterial', function() {
        $(this).closest('tr').remove();
    });
    $("#txtMaterial").val(null);
}

$("#btnHerramienta").click(function () {
    if ($("#txtHerramienta").val().trim() == "") {
        Swal.fire({
            icon: "error",
            text: "Debe ingresar una Herramienta",
          });
        return false;
    }
    AgregarHerramienta();
});
function AgregarHerramienta() {
    let Herramienta = $("#txtHerramienta").val().trim();
    
    let html = "<tr>";
        html += "<td>"+ Herramienta + "</td>";
        html += "<td>";
        html += "<button class='btn borrarHerramienta btn-danger btn-sm btn-danger'><i class='fa fa-trash'></i></button>";
        html += "</td>";
        html += "</tr>";

    $('#HerramientaBody').append(html);

    $('#HerramientaBody').on('click', '.borrarHerramienta', function() {
        $(this).closest('tr').remove();
    });
    $("#txtHerramienta").val(null);

}

$("#btnCrear").click(function () {
    if($("#selectEmpresa").val()=="" || $("#selectEmpresa").val()==0){
        Swal.fire({
            icon: "error",
            text: "Debe ingresar una Empresa",
          });
        return false;
    };

    if($("#selectSolicitante").val()=="" || $("#selectSolicitante").val()==0){
        Swal.fire({
            icon: "error",
            text: "Debe ingresar un Solicitante",
          });
        return false;
    };

    if($("#selectLugar").val()=="" || $("#selectLugar").val()==0){
        Swal.fire({
            icon: "error",
            text: "Debe ingresar un Lugar de atención",
          });
        return false;
    };

    if($('#tblItem tbody tr').length <= 0){
        Swal.fire({
            icon: "error",
            text: "Debe ingresar al menos 1 item",
          });
        return false;
    };

    if($('#tblMaterial tbody tr').length <= 0){
        Swal.fire({
            icon: "error",
            text: "Debe ingresar al menos 1 material",
          });
        return false;
    };

    if($('#tblHerramienta tbody tr').length <= 0){
        Swal.fire({
            icon: "error",
            text: "Debe ingresar al menos 1 herramienta",
          });
        return false;
    };

    emp = $("#selectEmpresa").val();
    sol = $("#selectSolicitante").val();
    lugar =$("#selectLugar").val();
    tiempo = $("#txtTiempo").val();
    let tablaItem = [];
    let tablaMaterial = [];
    let tablaHerramienta = [];
    
    $('#tblItem tbody tr').each(function() {
        var fila = [];
        $(this).find('td').not(':last').each(function() {
            fila.push($(this).text());
        });
        tablaItem.push(fila);
    });

    $('#tblMaterial tbody tr').each(function() {
        var fila = [];
        $(this).find('td').not(':last').each(function() {
            fila.push($(this).text());
        });
        tablaMaterial.push(fila);
    });

    $('#tblHerramienta tbody tr').each(function() {
        var fila = [];
        $(this).find('td').not(':last').each(function() {
            fila.push($(this).text());
        });
        tablaHerramienta.push(fila);
    });
    tablaItem = JSON.stringify(tablaItem);
    tablaMaterial = JSON.stringify(tablaMaterial);
    tablaHerramienta = JSON.stringify(tablaHerramienta);

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Home/CrearProforma/",
        dataType: 'json',
        data: JSON.stringify({solicitante: sol, lugar: lugar, idempresa: emp, tiempo: tiempo,items: tablaItem, material: tablaMaterial, herramienta: tablaHerramienta}),
        before: function (){
            Swal.fire({
                icon: "error",
                text: "Debe ingresar al menos 1 herramienta",
            });
        },
        success: function (response) {
            Swal.fire({
                icon: "success",
                text: "Se generó la proforma",
              });
            filename = response.filename;
            
            $('#btnDescargarProforma').prop('disabled', false);
            $('#btnDescargarProforma').data('file-url', filename);

            
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Ocurrió un error");
            return false;
        }
    });
});
$('#btnDescargarProforma').click(function() {
    window.location.href = '/media/' + filename;
});
// EDICION DE PROFORMAS

