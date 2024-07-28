import { Cliente } from "src/cliente/entities/cliente.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PagoMa {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('numeric',{
        nullable: false
    })
    valor: number;

    // @Column('timestamp',{
    //     nullable: true,
    //     default: () => 'CURRENT_TIMESTAMP'
    // })
    // createdAt: Date;

    // @Column('timestamp',{
    //     nullable: true,
    //     default: () => 'CURRENT_TIMESTAMP'
    // })
    // updatedAt: Date;

    @Column('timestamp', {
        default: () => "timezone('America/Bogota', now())",
      })
    createdAt: Date;
    
    @Column('timestamp', {
        nullable: true,
        default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota'"
    })
    updatedAt: Date;

    @ManyToOne(()=> Cliente, (cliente)=> cliente.pagoMas)
    cliente: Cliente;
} 
