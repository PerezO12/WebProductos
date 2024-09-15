// Obtener el token desde el localStorage
const token = localStorage.getItem('x-token');

// Referencias a los elementos del DOM
const btnCategoria = document.querySelector('#btnCategoria');
const btnProducto = document.querySelector('#btnProducto');
const productCategory = document.querySelector('#productCategory');

// Redirigir si no hay token
if (!token) {
    window.location.href = '/index.html';
}

// Función para cambiar entre formulario de producto y categoría
function toggleForm() {
    const entityType = document.getElementById('entityType').value;
    document.getElementById('productForm').style.display = (entityType === 'producto') ? 'block' : 'none';
    document.getElementById('categoryForm').style.display = (entityType === 'categoria') ? 'block' : 'none';
}

// Función para mostrar el nombre del archivo seleccionado
function displayFileName() {
    const fileInput = document.getElementById('productImage');
    const fileName = fileInput.files[0] ? fileInput.files[0].name : 'No se ha seleccionado ningún archivo';
    
    // Actualizar el texto del span con el nombre del archivo
    document.getElementById('file-selected').textContent = fileName;
}

// Obtener las categorías existentes y llenar el select
fetch('api/categorias')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }
        return response.json(); // Parsear la respuesta como JSON
    })
    .then(data => {
        // Agregar las categorías al select
        data.categorias.forEach(categoria => {
            const newOption = document.createElement('option');
            newOption.value = categoria.nombre;
            newOption.text = categoria.nombre;
            productCategory.appendChild(newOption);
        });
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud GET:', error);
    });

// Escuchar el clic en el botón de categoría para crear una nueva categoría
btnCategoria.addEventListener('click', () => {
    const nombreCategoria = document.getElementById('categoryName').value;
    
    fetch('api/categorias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
            'x-token': token  // Pasar el token de autenticación
        },
        body: JSON.stringify({ nombre: nombreCategoria }) // Convertir el objeto a JSON
    })
    .then(response => response.json())  // Convertir la respuesta a JSON
    .catch(error => console.error('Error creando categoría:', error));
});

// Función para manejar la creación del producto y subida de imagen
btnProducto.addEventListener('click', (event) => {
    event.preventDefault();  // Evitar que el formulario se recargue

    // Obtener los valores del formulario
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;
    const productCategory = document.getElementById('productCategory').value;
    const productImage = document.getElementById('productImage').files[0]; // Archivo seleccionado
   
    // Crear un objeto con los datos del nuevo producto
    const nuevoProducto = {
        nombre: productName,
        precio: productPrice,
        descripcion: productDescription,
        categoria: productCategory
    };
    
    // Crear el producto en la base de datos
    fetch('api/productos', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
            'x-token': token  // Pasar el token de autenticación
        },
        body: JSON.stringify(nuevoProducto) // Convertir el objeto a JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la creación del producto'); // Manejar error
        }
        return response.json();  // Convertir la respuesta a JSON
    })
    .then(data => {
        const idProducto = data._id;  // Obtener el ID del producto recién creado
        
        // Subir la imagen solo si se seleccionó un archivo
        if (productImage) {
            const formData = new FormData(); // Crear un FormData para manejar la subida de archivos
            formData.append('archivo', productImage); // Adjuntar el archivo al FormData

            // Subir la imagen al servidor
            window.location.reload()
            return fetch(`/api/uploads/productos/${idProducto}`, {
                method: 'PUT', 
                headers: {
                    'x-token': token  // Pasar el token de autenticación
                },
                body: formData  // Enviar el FormData con la imagen
            });
        }
    })
    .then(response => {
        if (response && response.ok) {
            return response.json();  // Leer la respuesta JSON después de subir la imagen
        } else {
            console.log('No se ha subido ninguna imagen.');
        }
    })
    .catch(error => {
        console.error('Hubo un error:', error); // Manejar errores
    });
});
