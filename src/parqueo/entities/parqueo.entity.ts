import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Parqueo {
    
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

    //fecha de creacion
    // @Column('timestamp',{
    //     default: () => 'CURRENT_TIMESTAMP'
    // })
    // entradadAt: Date;

    @Column('timestamp', {
        nullable: true,
        default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota'"
    })
    entradadAt: Date;

    //fecha de salida
    @Column('timestamp',{
        nullable: true
    })
    salidasAt: Date;

}
