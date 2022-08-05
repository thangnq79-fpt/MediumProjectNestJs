import { hash, genSalt } from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column({ default: '' })
  bio: string;
  @Column({ default: '' })
  image: string;
  @Column()
  username: string;
  @Column({ select: false })
  password: string;
  @BeforeInsert()
  async hassPassword() {
    this.password = await hash(this.password, 10);
  }
}
