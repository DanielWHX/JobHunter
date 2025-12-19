import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserPreferences } from './user-preferences.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string;

  @Column({ name: 'github_username', nullable: true })
  githubUsername?: string;

  @Column({ name: 'leetcode_username', nullable: true })
  leetcodeUsername?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login', nullable: true })
  lastLogin?: Date;

  @OneToOne(() => UserPreferences, (preferences) => preferences.user)
  preferences?: UserPreferences;
}
