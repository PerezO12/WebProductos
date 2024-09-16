document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que se recargue la página

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const requestBody = {
        correo: username,
        password: password
    };

    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.usuario && data.token) {
            localStorage.setItem('x-token', data.token); // Guardar token en el almacenamiento local
            localStorage.setItem('username', data.usuario.nombre); // Guardar nombre de usuario del servidor
            window.location.href = '/store';
        } else {
            alert('Autenticación fallida: ' + (data.msg || 'Credenciales incorrectas'));
        }
    })
    .catch(error => {
        console.error('Error en la autenticación:', error);
        alert('Error en el servidor. Intente de nuevo más tarde.');
    });
});


//EJEMPLO DE USO DE TOCKEN PARA SOLICITUDES
/* 
fetch('http://localhost:8081/api/some-protected-route', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Utiliza el token desde el almacenamiento local
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error con la solicitud:', error));
 */