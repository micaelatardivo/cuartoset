let carritoDeCompras = []

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

/* tiempo de carga */

$(document).ready(function () { 
    $('#contenedor-productos').append('<div class="d-flex ml-5"><strong>Loading...</strong><div class="spinner-border ml-auto" role="status" aria-hidden="true"></div></div>')
    setTimeout(() => {
        mostrarProductos(stockProductos)
    }, 1000);

 })

/* productos asincronicos */

$.getJSON("/data/productos.json", function (datos, estado){
    datos.forEach(prod => stockProductos.push(prod));
    mostrarProductos(stockProductos)})

/* mensaje alerta */

const alertaProducto = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

/* contenedor productos */

function mostrarProductos(array){
   $('#contenedor-productos').empty()
    for (const producto of array) {
        $('#contenedor-productos').append 
                                    (`<div class="col d-flex justify-content-around m-4">
                                        <div class="card-deck border border-info rounded" style="width: 18rem;">
                                        <div class="spinner-border text-success m-5 loader" role="status">
                                            <span class="sr-only">Cargando...</span>
                                        </div>
                                        <img src="${producto.img}" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <h5 class="card-title text-primary">${producto.nombre}</h5>
                                            <span class="badge badge-warning">${producto.categoria}</span>
                                            <p class="card-text">${producto.desc}</p>
                                            <p class="card-text">${producto.peso}</p>
                                            <p class="card-text"><span class="badge badge-pill badge-secondary">$${producto.precio}</span></p>
                                            <a id="boton${producto.id}" class="btn badge-pill badge-success align-center"><i class="fas fa-shopping-cart"></i></a>
                                        </div>
                                        </div>
                                    </div>`)
                                            
        $('.card-img-top').on('load',function () {
            $(this).css({'display': 'none'})
            setTimeout(() => {
                $(this).css({'display': 'block'})
                $('.loader').css({'display': 'none'})
            }, 2000);
          })

        $(`#boton${producto.id}`).click(() => {
            agregarAlCarrito(producto.id);

            alertaProducto.fire({
                icon: 'success',
                title: 'Producto agregado correctamente.'
        });
        })
    }
    
}

/* agregar carrito */

function agregarAlCarrito(id) {
    let repetido = carritoDeCompras.find(prodR => prodR.id == id);

    if(repetido){
        repetido.cantidad = repetido.cantidad + 1;
        $(`#cantidad${repetido.id}`).html(`Cantidad: ${repetido.cantidad}`) 
        actualizarCarrito()
    }else{
        let productoAgregar = stockProductos.find(prod => prod.id == id);

        carritoDeCompras.push(productoAgregar);

        productoAgregar.cantidad = 1;
       
        actualizarCarrito()
        $('#carrito-contenedor').append(`<div class="productoEnCarrito">
                                            <p>${productoAgregar.nombre}</p>
                                            <p>${productoAgregar.desc}</p>
                                            <p>Precio: $${productoAgregar.precio}</p>
                                            <p id="cantidad${productoAgregar.id}">Cantidad: ${productoAgregar.cantidad}</p>
                                            <button id="eliminar${productoAgregar.id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
                                        </div>`) 
        
       
        $(`#eliminar${productoAgregar.id}`).click(function () {
            $(this).parent().remove()
            carritoDeCompras = carritoDeCompras.filter(prodE => prodE.id != productoAgregar.id)
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
            actualizarCarrito()

              alertaProducto.fire({
                icon: 'error',
                title: 'Producto eliminado correctamente.'
              })
          }) 
    }
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
}

/* agregar y actualizar carrito */

function recuperar() {
    let recuperado = JSON.parse(localStorage.getItem('carrito')) 
    
   if(recuperado){
       recuperado.forEach(el => {
           agregarAlCarrito(el.id)
       });
   }
}

recuperar()

function  actualizarCarrito (){
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el)=> acc + el.cantidad, 0);
   precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
}

/* selector marcas */

function selectUI(lista, selector) {
    $(selector).empty();
    for (const categoria of lista) {
      $(selector).append(`<option>${categoria}</option>`);  
    }
      $(selector).prepend(`<option selected> Todas las marcas </option>`);  
  }
  
  function buscarCategoria() {
  
    let valor=this.value;
   
    $("#contenedor-productos").fadeOut(2000,function () {
     
      if(valor != "Todas las marcas"){
       
        let filtrados= stockProductos.filter(producto => producto.categoria == valor);
        
        mostrarProductos(filtrados,"#contenedor-productos");
      }else{
    
        mostrarProductos(stockProductos,"#contenedor-productos");
      }    
    }).fadeIn(2000);
    
  }


selectUI(categorias,"#categoria");
$("#categoria").on("change", buscarCategoria)
