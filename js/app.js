const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registroPorPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {

    formulario.addEventListener('submit', validarFormulario);


}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if ( terminoBusqueda === ''){
        console.log('Error!');
        mostrarAlerta('Agrega un termino de busqueda');
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-200');

    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-200', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold"> Error! </strong> 
            <span class="block sm:inline"> ${mensaje} </span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes(){
    const termino = document.querySelector('#termino').value;

    const apiKey = '25760499-ceedd3c1f7823e72513b30bb7';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        });
}

// Genearador que va registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    console.log(total);
    for (let i = 0; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total){
    return parseInt( Math.ceil( total / registroPorPagina ));
}

function mostrarImagenes(imagenes) {
    console.log(imagenes)
    
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    imagenes.forEach( imagen => {
        const { previewURL, likes, largeImageURL, views } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w1/4 p-3 mb-4 ">
                <div class="bg-white shadow-md" >
                    <img class="w-full" src="${previewURL}" />

                    <div class="w-full p-4 flex-icon">
                        <div  class=" ">  
                            <span>  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2zM20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2z"></path></svg> 
                            </span> 
                            <span class="font-bold "> ${likes} </span> 
                         </div>
                         <div  class="text-right">  
                            <span>  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316-.105-.316C21.927 11.617 19.633 5 12 5zm0 11c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"></path><path d="M12 10c-1.084 0-2 .916-2 2s.916 2 2 2 2-.916 2-2-.916-2-2-2z"></path></svg> 
                            </span> 
                            <span class="font-bold "> ${views} </span> 
                         </div>

                         <a class=" block w-full text-center mt-5 btn-img px-5 py-2 uppercase font-bold" href="${largeImageURL}" target="_blank" rel="noopener noreferrer"> Ver imagen </a>
                    </div>
                </div>
            </div>
        `;
    });

    while (paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

        imprimirPaginacion();
    
}

function imprimirPaginacion() {
    iterador = crearPaginador(totalPaginas);
    console.log(iterador.next().done)

    while (true) {
        const { value, done } = iterador.next();
        if(done){
            return;
            
        } else{
            // En caso contrario, genera un boton por cada elemento en el generador
            const boton = document.createElement('a');
            boton.href = '#';
            boton.dataset.pagina = value;
            boton.textContent = value;
            boton.classList.add('siguiente', 'bg-blue-600', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded', 'text-white');
            paginacionDiv.appendChild(boton);

            boton.onclick = () => {
                paginaActual = value;

                buscarImagenes();
            }

        }

    }
}