import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class FiltroFechaDto {
    @IsDate()
    @Type(() => Date)
    fecha: Date;

    @IsString()
    tipoFiltro: 'dia' | 'mes' | 'anio';
}