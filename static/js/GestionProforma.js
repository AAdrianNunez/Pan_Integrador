var globalList = "";
let data;
let dataTableIsInitialized = false
$(document).ready(function () {
    DatatableProforma();
    //ListarProformas();
    //GenerarProforma();
});
// new DataTable('#example');

function DatatableProforma(){
    let html = "<table id='tblResult' class='table table-striped table-light'>";
    html += "<thead class='thead-dark'>";
    html += "<tr>";
    html += "<th>Numero</th>";
    html += "<th>Descripcion</th>";
    html += "<th>Empresa</th>";
    html += "<th>Solicitante</th>";
    html += "<th>Lugar</th>";
    html += "<th>FechaCreacion</th>";
    html += "<th>PrecioTotal</th>";
    html += "<th>Acción</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    html += "</tbody>";
    html += "</table>";

    // Limpiar y añadir la tabla al contenedor
    $("#divProforma").empty();
    $("#divProforma").append(html);

    // Inicializar DataTable
    $('#tblResult').DataTable({
        
        ajax: {
            "url": "Home/ListarProforma",
            "type": "GET",
            "dataSrc": function (json) {
                return json;
            }
        },
        columns: [
            { "width": "10%", "data": "Numero", "name": "Numero" },
            { "width": "20%", "data": "Descripcion", "name": "Descripcion" },
            { "className": "text-center", "width": "15%", "data": "Empresa", "name": "Empresa" },
            { "width": "15%", "data": "Solicitante", "name": "Solicitante" },
            { "className": "text-center", "width": "10%", "data": "Lugar", "name": "Lugar" },
            { "className": "text-center", "width": "10%", "data": "FechaCreacion", "name": "FechaCreacion" },
            { "className": "text-center", "width": "10%", "data": "PrecioTotal", "name": "PrecioTotal" },
            { "className": "text-center", "width": "10%", "data": "IDProforma", "name": "IDProforma" }
        ],
        order: [],
        columnDefs: [
            {
                "render": function (data, type, row) {
                    return "<button type='button' class='btn btn-primary btn-sm' style='margin-right:5px;' tittle='Editar' onclick='EditarProforma(" + data + ")'><i class='fa fa-pencil'></i></button>" + 
                           "<button type='button' class='btn btn-warning btn-sm' style='margin-right:5px;' tittle='Editar'><i class='fa fa-file-text-o'></i></button>"
                },
                "targets": [7]
            },
        ],

        language: {
            "lengthMenu": "_MENU_",
            "info": "Mostrando página _PAGE_ de _PAGES_. Total _TOTAL_ registros.",
            "processing": '<i class="fa fa-spinner fa-spin fa-3x fa-fw" style="color:#2a2b2b;"></i><span class="sr-only">Loading...</span>',
            "sSearch": "Buscar:",
            "sZeroRecords": "No se encontraron resultados",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtrado de _MAX_ registros totales).",
            "paginate": {
                "next": "Siguiente",
                "previous": "Anterior",
            },
        },
        lengthMenu: [10, 50, 100],
        bLengthChange: true,
        searching: true,
        responsive: true,
        paging: true,
        pageLength: 10,
        dom: 'tr<"info-datetable"i><"paginate-datetable"l><"paginate-datetable"p>'       
    }).page(0).draw('page');
    // $("select[name='tblResult_length']").addClass("select2").select2({
    //     minimumResultsForSearch: Infinity,
    // });
}


function GenerarProforma() {
    let html = "<table id='tblResult' class='table table-striped table-light'>";
    html += "<thead class='thead-dark'>";
    html += "<tr>";
    html += "<th>Numero</th>";
    html += "<th>Descripcion</th>";
    html += "<th>Empresa</th>";
    html += "<th>Solicitante</th>";
    html += "<th>Lugar</th>";
    html += "<th>FechaCreacion</th>";
    html += "<th>PrecioTotal</th>";
    html += "<th>Acción</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    html += "</tbody>";
    html += "</table>";
    $("#divProforma").empty();
    $("#divProforma").append(html);
    let DataTable = $("#tblResult").DataTable({
        serverSide: true,
        processing: true,
        ajax: {
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "Home/ListarProforma/",
            dataType: "json",
            data: function (parameter) {
                return JSON.stringify(parameter);
            },
            dataSrc: function (json) {
                globalList = json.data;
                return json.data;
            },
            error: function(xhr, status, error) {
                console.log("AJAX error: ", error);
                console.log("Status: ", status);
                console.log("XHR: ", xhr);
            }
        },
        columns: [
            {data : 'Numero'},
            {data : 'Descripcion'},
            {data : 'Empresa'},
            {data : 'Solicitante'},
            {data : 'Lugar'},
            {data : 'FechaCreacion'},
            {data : 'PrecioTotal'},
            {   data : null,
                render: function(data, type, row){
                    return "<button type='button' class='btn btn-primary btn-sm' style='margin-right:5px;' tittle='Editar' onclick='EditarProforma(" + row.Numero + ")'><i class='fa fa-pencil'></i></button>" + 
                           "<button type='button' class='btn btn-danger btn-sm' style='margin-right:5px;' tittle='Desaprobar'><i class='fa fa-times'></i></button>" +
                           "<button type='button' class='btn btn-warning btn-sm' style='margin-right:5px;' tittle='GenerarInforme'><i class='fa fa-file-text-o'></i></button>"
                }
            }
        ],
        language: {
            "lengthMenu": "_MENU_",
            "info": "Mostrando página _PAGE_ de _PAGES_. Total _TOTAL_ registros.",
            "processing": '<i class="fa fa-spinner fa-spin fa-3x fa-fw" style="color:#2a2b2b;"></i><span class="sr-only">Loading...</span>',
            "sSearch": "Buscar:",
            "sZeroRecords": "No se encontraron resultados",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtrado de _MAX_ registros totales).",
            "paginate": {
                "next": "Siguiente",
                "previous": "Anterior",
            },
        },
        lengthMenu: [10, 50, 100],
        bLengthChange: true,
        searching: true,
        responsive: true,
        paging: true,
        pageLength: 10,
        dom: 'tr<"info-datetable"i><"paginate-datetable"l><"paginate-datetable"p>'
    }).page(0).draw('page');
  
}

function EditarProforma(IDProforma){
    console.log(IDProforma);
    window.location.href = "/NuevaProforma?id=" + IDProforma;

}


$("#btnNuevo").click(function () {
    window.location.href = "/NuevaProforma"
});
