import { IsNumber, IsString } from "class-validator";

export class CreateAlquilerDto {

    @IsString()
    nombreCliente: string;

    @IsString()
    tipo: string;

    @IsNumber()
    precio: number;


}
