import { IsDate, IsNumber, IsString, IsUUID } from "class-validator";
import { Entity } from "typeorm";

@Entity()
export class CreateHistorialAlquilerDto {
    @IsString()
    nombreCliente: string;

    @IsString()
    tipo: string;

    @IsNumber()
    precio: number;

    @IsDate()
    fechaSalida: Date

    @IsUUID()
    idAlquiler: string;
}
