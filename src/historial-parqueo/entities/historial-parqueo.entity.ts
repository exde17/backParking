import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class HistorialParqueo {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        nullable: false
    })
    tipo: string;

    @Column('text',{
        nullable: false
    })
    placa: string;

    @Column('numeric',{
        nullable: false
    })
    valor: number;

    //fecha de entrada
    @Column('timestamp',{
        nullable: false,
    })
    entradadAt: Date;

    //fecha de salida
    @Column('timestamp',{
        nullable: false
    })
    salidasAt: Date;
}
