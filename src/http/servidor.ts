import express from 'express';
import { InMemoryPrestamoRepository } from '../infra/in-memory-prestamo.repository.js';
import { PrestamoService } from '../servicios/prestamo.service.js';
import { aResponseDto, ErrorResponseDto } from '../contrato/prestamo-response.dto.js';
import { validarCrearPrestamo } from './validar.js';

const PORT = 3000;

const repositorio = new InMemoryPrestamoRepository();

const servicio = new PrestamoService(repositorio);

const app = express();

app.use(express.json());

app.use(express.static('dist/cliente'));

//GET /api/prestamos?libroId=LIB-0417
app.get('/api/prestamos', async (req, res)=>{
    const libroId = req.query.libroId as string | undefined;
    if(libroId === undefined || libroId.trim() ===''){
        const error: ErrorResponseDto = {
            error : "PARAMETRO_FALTANTE",
            mensaje: "Se requiere el parametro libroId"
        }
        res.status(400).json(error);
        return;
    }

    const prestamos = await servicio.listarPorLibro(libroId);

    res.status(200).json(prestamos.map(aResponseDto));

})

app.post('/api/prestamos', async(req, res) => {
    const dto = validarCrearPrestamo(req.body);

    const prestamo = await servicio.crear(dto);

    res.status(201).json(aResponseDto(prestamo));
})

app.listen(PORT, ()=> {
    console.log("El servidor esta corriendo en el puerto" + PORT);
})