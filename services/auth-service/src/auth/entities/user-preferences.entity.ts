import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'daily_leetcode_goal', default: 2 })
  dailyLeetcodeGoal: number;

  @Column({ name: 'daily_application_goal', default: 5 })
  dailyApplicationGoal: number;

  @Column({ name: 'daily_project_hours', type: 'decimal', precision: 4, scale: 2, default: 2.0 })
  dailyProjectHours: number;

  @Column({ name: 'notification_time', type: 'time', default: '20:00:00' })
  notificationTime: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.preferences)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
