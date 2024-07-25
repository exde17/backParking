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
    
        //fecha de creacion
        @Column('timestamp',{
            default: () => 'CURRENT_TIMESTAMP'
        })
        entradadAt: Date;
    
        //fecha de salida
        @Column('timestamp',{
            nullable: true
        })
        salidasAt: Date;
}
