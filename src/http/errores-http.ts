export class ValidacionError extends Error{
    constructor(public readonly detalle: string[]){
        super('La peticion no cumplio con el contrato establecido');
        this.name = 'ValidationError';
    }
}