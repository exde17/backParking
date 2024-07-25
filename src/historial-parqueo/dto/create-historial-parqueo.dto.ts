import { IsNumber, IsString } from "class-validator";

export class CreateHistorialParqueoDto {

    @IsString()
    tipo: string;

    @IsString()
    placa: string;

    @IsString()
    entradadAt: Date;

    @IsString()
    salidasAt: Date;

    @IsNumber()
    valor: number;
}
