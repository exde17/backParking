import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Alquiler {
        
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
    

        @Column('timestamp', {
            default: () => "timezone('America/Bogota', now())",
          })
        entradadAt: Date;
    
        //fecha de salida
        @Column('timestamp',{
            nullable: true
        })
        salidasAt: Date;

        @Column('bool',{
            nullable: false,
            default: true
        })
        isActive: boolean;

        @Column('bool',{
            nullable: false,
            default: false
        })
        pending: boolean;
}
