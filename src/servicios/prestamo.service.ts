// =====================================================================
//  CHECKPOINT 4  —  el Service: aqui y SOLO aqui viven las reglas
// =====================================================================
//  Regla de negocio de esta practica:
//    "no se puede prestar un ejemplar que ya esta prestado"
//
//  TODO 4:
//    1. Recibir el repositorio POR CONSTRUCTOR, tipado con la
//       INTERFAZ `PrestamoRepository`, nunca con la clase concreta.
//    2. Metodo `crear(dto: CrearPrestamoDto): Promise<Prestamo>`:
//         a. pedir al repositorio los prestamos de ese libro
//         b. juntar los ejemplares que ya estan fuera
//            (pista: `.filter(...)` por estado + `.flatMap(...)`)
//         c. si alguno de los solicitados choca, lanzar
//            `new EjemplarPrestadoError(numero)`
//         d. si no, guardar el prestamo nuevo y devolverlo
//    3. Metodo `listarPorLibro(libroId)` que solo delega al repositorio.
//
//  LA PRUEBA DE FUEGO de este archivo:
//    ¿aparece la palabra `InMemory` en algun import? Si aparece, el
//    Service quedo acoplado a la infraestructura y el patron se rompio.
// =====================================================================

import type { PrestamoRepository } from '../dominio/prestamo.repository.js';
import type { Prestamo } from '../dominio/prestamo.entity.js';
import { nuevoFolio } from '../dominio/prestamo.entity.js';
import type { CrearPrestamoDto } from '../dto/crear-prestamo.dto.js';
import { EjemplarPrestadoError } from '../errores/ejemplar-prestado.error.js';

export class PrestamoService {
  // TODO 4.1: constructor que recibe el repositorio
  constructor(private readonly repo: PrestamoRepository){

  }

  // TODO 4.2: metodo crear()
  async crear(dto: CrearPrestamoDto): Promise<Prestamo>{
    const delLibro = await this.repo.findByLibro(dto.libroId);

    const fuera = delLibro
    .filter(p=> p.estado === 'activo' || p.estado === 'vencido')
    .flatMap(p => p.ejemplares);

    const choque = dto.ejemplares.find(e=> fuera.includes(e));

    if(choque !== undefined){
      throw new EjemplarPrestadoError(choque);
    }

    const prestamo: Prestamo = {
      folio: nuevoFolio(),
      creadoEn: new Date(),
      estado: "activo",
      costoReposicion: 350,
      libroId: dto.libroId,
      socioId: dto.socioId,
      ejemplares: dto.ejemplares
    }

    return this.repo.save(prestamo);

  }


  // TODO 4.3: metodo listarPorLibro()
  async listarPorLibro(libroId: string): Promise<Prestamo[]>{
    return this.repo.findByLibro(libroId)
  }
}
