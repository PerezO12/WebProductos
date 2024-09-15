// Script para mostrar el nombre de usuario en la página de la tienda
const token = localStorage.getItem('x-token');
const addButton = document.querySelector('#addButton');
const cerrarSeccion = document.querySelector('#closeSectionButton');

if (!token){
        window.location.href = '/'
    }

function displayProducts() {
    const productDisplay = document.getElementById('productDisplay');
    productDisplay.innerHTML = ''; // Limpiar el contenido existente

    products.forEach(product => {

    });
}

// Llamar a la función cuando la página esté cargada
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});

document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    if (username) {
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = username;
        } else {
            console.error('Elemento con id "userName" no encontrado');
        }
    } else {
        console.error('Nombre de usuario no encontrado en el almacenamiento local');
    }
});

//fetch a los productos
 fetch('api/productos')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.status);
    }
    return response.json(); // Parsear la respuesta como JSON
  })
  
  .then(data => {
    console.log(data.productos);
    data.productos.forEach( producto => {
        console.log('Nombre:', producto.nombre); // Imprimir los datos en la consola
                // Crear el HTML para cada producto
            const productCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card shadow-sm product-card">
                            <img src="${producto.img}" alt="${producto.nombre}" class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title">${producto.nombre}</h5>
                                <p class="card-text">$${producto.precio}</p>
                                <p class="card-text text-muted">Disponible: ${producto.disponible ? 'Si' : 'No'}</p>
                                <p class="card-text text-muted">Vendedor: ${producto.usuario}</p>
                                <div class="product-description">
                                    <p>${producto.descripcion}.</p>
                                </div>
                                <a href="#" class="btn btn-primary">Agregar al carrito</a>
                            </div>
                        </div>
                    </div>
            `;
    
            // Agregar el HTML al contenedor de productos
            productDisplay.innerHTML += productCard;
    })
  })
  .catch(error => {
    console.error('Hubo un problema con la solicitud GET:', error);
  });
 

// fetch para obtener las categorías
const listaCategorias = document.getElementById('categoryList'); // Asegurarse de seleccionar el ul correctamente

fetch('api/categorias')
.then(response => {
    if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.status);
    }
    return response.json(); // Parsear la respuesta como JSON
    })
.then(data => {
        //console.log('Datos recibidos:', data.categorias); // Imprimir los datos en la consola

        // Agregar las nuevas categorías al menú
        data.categorias.forEach(categoria => {
        // console.log(categoria.nombre);

        const nuevoLi = document.createElement('li');
        const nuevoA = document.createElement('a');
        nuevoA.href = `#${categoria.id}`; // Asignar href para la categoría
        nuevoA.id = categoria.id;        // Asignar el id
        nuevoA.textContent = categoria.nombre; // Asignar el texto que se mostrará
        
        nuevoLi.appendChild(nuevoA); // Añadir el enlace dentro del li
        listaCategorias.appendChild(nuevoLi); // Añadir el li dentro del ul
    });
})
.catch(error => {
    console.error('Hubo un problema con la solicitud GET:', error);
});
  
   
addButton.addEventListener('click', () => {
    window.location.href = '/crearProducto.html';
})

cerrarSeccion.addEventListener('click', () => {
    localStorage.removeItem('x-token');
    alert('Sesion cerrada');
    window.location.href = '/';
})