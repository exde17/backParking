import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class HistorialAlquiler {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        nullable: false,
        name: 'nombre_cliente'
    })
    nombreCliente: string;

    @Column('text',{
        nullable: false
    })
    tipo: string;

    @Column('numeric',{
        nullable: false
    })
    precio: number;

    @Column('timestamp',{
        default: () => 'CURRENT_TIMESTAMP',
        name: 'fecha-entrega'
    })
    fechaEntrega: Date;

    @Column('timestamp',{
        nullable: false,
        name: 'fecha-salida'
    })
    fechaSalida: Date
}
