import { IsDate, IsString } from "class-validator";

export class CreateParqueoDto {

    @IsString()
    tipo: string;

    @IsString()
    placa: string;

    @IsDate()
    salidasAt: Date;
}
