import { IsNumber, IsString, IsUUID } from "class-validator";
import { Cliente } from "src/cliente/entities/cliente.entity";

export class CreatePagoTotalDto {

    @IsNumber()
    valor: number;

    // @IsString()
    // cliente: Cliente;

    @IsUUID()
    cliente: string;
}
