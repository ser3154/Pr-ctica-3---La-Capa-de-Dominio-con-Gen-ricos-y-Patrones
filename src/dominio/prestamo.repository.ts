//  Cada entidad hereda el contrato comun y agrega SOLO sus consultas
//  propias. Eso es lo que hace `extends` sobre una interfaz generica.
//
//  TODO:
//    1. Hacer que PrestamoRepository extienda Repository<Prestamo>.
//    2. Agregarle un metodo propio:
//         findByLibro(libroId: string): Promise<Prestamo[]>
// =====================================================================

import type { Repository } from './repository.js';
import type { Prestamo } from './prestamo.entity.js';

export interface PrestamoRepository extends Repository<Prestamo>{
  // TODO 1b: extender Repository<Prestamo> y agregar findByLibro
  findByLibro(libroId: string): Promise<Prestamo[]>
}
