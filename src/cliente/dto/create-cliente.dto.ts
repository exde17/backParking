import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateClienteDto {
    @IsString()
    readonly nombre: string;

    @IsString()
    @IsOptional()
    readonly apellido?: string;

    @IsString()
    @IsOptional()
    readonly documento?: string;

    @IsNumber()
    readonly valor: number;

    @IsString()
    @IsOptional()
    readonly telefono?: string;

    @IsString()
    @IsOptional()
    readonly guarda?: string;

    @IsBoolean()
    @IsOptional()
    readonly pagoMensual?: boolean;
}
