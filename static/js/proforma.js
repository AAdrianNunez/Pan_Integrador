const csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
var items = 1;
var btnAdd = document.getElementById("btnAdd");
var btnDelete = document.getElementById("btnDelete");
var Items = document.getElementById("Items");

var precios = document.querySelectorAll('.precioTotal');
var total = document.getElementById("txtSumaTotal");
var num_rows = 1;

$(document).ready(function() {
    
});

function Generar_Proforma(){
    let solicitante = $("#selectSolicitante").val();
    let lugar = $("#selectLugar").val();
    let Material = $('#txtMaterial').val().split("\n");
    let json_Material = JSON.stringify(Material);
    let tiempo = $("#txtTiempo").val();
    let lista_items = [];
        
    $('.Cantidad').each(function(index) {
        let cantidad = $(this).val();
        let descripcion = ($('.Item').eq(index).val()).toUpperCase();
        let precio_uni = parseFloat($('.precioUnitario').eq(index).val()).toFixed(2);
        let PrecioTotal = $('.precioTotal').eq(index).val();
        let item = {
            cantidad: cantidad,
            descripcion: descripcion,
            precio_uni: precio_uni,
            PrecioTotal: PrecioTotal
        };
        lista_items.push(item);
    });

    let json_lista_items = JSON.stringify(lista_items);
    $.ajax({
        type: 'POST',
        url:'Generar_Proforma/',
        headers: {'X-CSRFToken': csrftoken},
        dataType: 'json',
        data: {solicitante: solicitante,lugar: lugar, Material: json_Material, tiempo:tiempo, lista_items:json_lista_items},
        success: function(response){
            console.log(response);
        }

    });
}
$('#btnGenerarProforma').click(function(){
    Generar_Proforma();
});
$('#btnAdd').click(function(){
    AddRow();
});
$('#btnDelete').click(function(){
    DeleteRows();
})
function AddRow(){
    if(num_rows === 10){
        alert("Es el limite de filas");
    }else {
        items++;
        var new_row = document.createElement("div");
        new_row.className = 'row mt-2';

        var new_cant = document.createElement("div");
        new_cant.className = 'col-1';
        new_cant.innerHTML = '<input class="form-control form-control-sm Cantidad" required value="1" type="number" min="1" id="txtCant'+ items +'" onchange="updateTotalForRow('+ items +')">';

        var new_item = document.createElement("div");
        new_item.className = 'col-5';
        new_item.innerHTML = "<input class='form-control form-control-sm Item contar-caracteres' required type='text' id='txtDescripcion"+ items +"'>";

        var new_pu = document.createElement("div");
        new_pu.className = 'col col-md-auto';
        new_pu.innerHTML = '<input class="form-control form-control-sm precioUnitario" required value="1" type="number" min="1" id="txtPrecioUnitario'+ items +'" onchange="updateTotalForRow('+ items +')">';

        var new_ptotal = document.createElement("div");
        new_ptotal.className = 'col col-md-auto';
        new_ptotal.innerHTML = "<input class='form-control form-control-sm precioTotal' disabled type='number' id='txtPrecioTotal"+ items +"'>";
        num_rows++;

        new_row.appendChild(new_cant);
        new_row.appendChild(new_item);
        new_row.appendChild(new_pu);
        new_row.appendChild(new_ptotal);
        Items.appendChild(new_row);

    }
}
function DeleteRows(){
    if (items === 1){
        alert("NO PUEDES ELIMINAR TODO BABOSO");
    } else {
        items--;
        var lastRow = Items.lastElementChild;
        Items.removeChild(lastRow);
        UpdateTotal();
        num_rows--;
    }
}


precios.forEach(function(precioInput) {
    precioInput.addEventListener('change', function() {
        var sumaTotal = 0;
        precios.forEach(function(precio) {
            sumaTotal += parseFloat(precio.value) || 0;
        });
        total.value = sumaTotal.toFixed(2);
    });
});
function UpdateTotal() {
    var precios = document.querySelectorAll('.precioTotal');
    var sumaTotal = 0;

    precios.forEach(function(precio) {
        sumaTotal += parseFloat(precio.value) || 0;
    });

    total.value = sumaTotal.toFixed(2);
};

function updateTotalForRow(row) {
    let cantidad = parseFloat(document.getElementById('txtCant' + row).value) || 0;
    let precioUnitario = parseFloat(document.getElementById('txtPrecioUnitario' + row).value) || 0;
    let PrecioTotal = cantidad * precioUnitario;

    document.getElementById('txtPrecioTotal' + row).value = PrecioTotal.toFixed(2);
    UpdateTotal();
    
};

aux = false;
function NumeroFilas(){
    const item_text = document.querySelectorAll('.Item');
    item_text.forEach((campo) =>{
        if ((campo.value.length -1) % 52 === 0  && aux === false && (campo.value.length != 1)){
            num_rows++;
            aux = true
        } 
        if ((campo.value.length) % 52 === 0  && aux === true){
            num_rows--;
            aux = false
        }
        document.getElementById("num_rows").textContent = "N° Filas: " + num_rows

    })
};
// var band = false
// function contarCaracteres() {
//     const camposEntrada = document.querySelectorAll('.contar-caracteres');
//     camposEntrada.forEach((campo) => {
//         if (campo.value.length > 52 && band === false) {
//             num_rows++;
//             band = true
//         } else if (campo.value.length <= 52 && band === true) {
//             num_rows--;
//             band = false
//         }
//     });
//     document.getElementById("num_rows").textContent = "N° Filas: " + num_rows

// }

document.addEventListener('input', NumeroFilas);
var contadorSaltosDeLinea = 0
function contarSaltosDeLinea() {
    const texto = document.getElementById("txtMaterial").value;
    const lineasAntes = contadorSaltosDeLinea;
    const lineasDespues = (texto.match(/\n/g) || []).length + 1;

    if (lineasDespues > lineasAntes) {
        contadorSaltosDeLinea++;
        num_rows++;
    } else if (lineasDespues < lineasAntes) {
        contadorSaltosDeLinea--;
        num_rows--;
    }
}
document.getElementById("txtMaterial").addEventListener("input", contarSaltosDeLinea);

