import { ArticleEntity } from '@app/article/article.entity';
import { hash, genSalt } from 'bcrypt';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

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
  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];
}
