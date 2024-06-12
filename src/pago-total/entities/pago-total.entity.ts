import { Cliente } from "src/cliente/entities/cliente.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PagoTotal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('numeric',{
        nullable: false
    })
    valor: number;

    @Column('timestamp',{
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @Column('timestamp',{
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date;

    @ManyToOne(()=> Cliente, (cliente)=> cliente.pagoTo)
    cliente: Cliente;
}
