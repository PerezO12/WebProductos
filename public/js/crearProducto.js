const token = localStorage.getItem('x-token');
const btnCategoria = document.querySelector('#btnCategoria');
const btnProducto = document.querySelector('#btnProducto');
const productCategory = document.querySelector('#productCategory');

// Redirigir si no hay token
if (!token) {
    window.location.href = '/index.html';
}

// Cambiar entre producto y categoría
function toggleForm() {
    const entityType = document.getElementById('entityType').value;
    document.getElementById('productForm').style.display = (entityType === 'producto') ? 'block' : 'none';
    document.getElementById('categoryForm').style.display = (entityType === 'categoria') ? 'block' : 'none';
}

//Obtener las categorias existentes
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
        const newOption = document.createElement('option');
        newOption.value = categoria.nombre;
        newOption.text = categoria.nombre;
        // Agregar la nueva opción al select
        productCategory.appendChild(newOption);
    });
})
.catch(error => {
    console.error('Hubo un problema con la solicitud GET:', error);
});






// Escuchar el clic en el botón y prevenir el comportamiento predeterminado
btnCategoria.addEventListener('click', () => {

    const nombreCategoria = document.getElementById('categoryName').value;
    
    fetch('api/categorias', {
        method: 'POST', // Especificar el método POST
        headers: {
            'Content-Type': 'application/json', // Especificar que el contenido es JSON
            'x-token': `${token}`  // Si necesitas pasar un token de autenticación
        },
        body: JSON.stringify({nombre: nombreCategoria}) // Convertir el objeto a JSON y pasarlo en el cuerpo de la solicitud
    })
    .then(response => response.json())  // Convertir la respuesta a JSON
});

// Función para obtener los valores del formulario y mostrarlos en la consola
btnProducto.addEventListener('click', (event) => {
    // Obtener los valores del formulario
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;
    const productCategory = document.getElementById('productCategory').value;

    // Crear un objeto con los valores del formulario
    const nuevoProducto = {
        nombre: productName,
        precio: productPrice,
        descripcion: productDescription,
        categoria: productCategory
    };
    
    fetch('api/productos', {
        method: 'POST', // Especificar el método POST
        headers: {
            'Content-Type': 'application/json', // Especificar que el contenido es JSON
            'x-token': `${token}`  // Si necesitas pasar un token de autenticación
        },
        body: JSON.stringify(nuevoProducto) // Convertir el objeto a JSON y pasarlo en el cuerpo de la solicitud
    })
    .then(response => response.json())  // Convertir la respuesta a JSON
});