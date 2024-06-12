import { IsNumber, IsString } from "class-validator";
import { Cliente } from "src/cliente/entities/cliente.entity";

export class CreatePagoTotalDto {

    @IsNumber()
    readonly valor: number;

    @IsString()
    readonly cliente: Cliente;
}
