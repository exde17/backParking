import { IsNumber, IsString } from "class-validator";
import { Cliente } from "src/cliente/entities/cliente.entity";

export class CreatePagoMaDto {
    @IsNumber()
    readonly valor: number;

    @IsString()
    readonly cliente: Cliente;
}
