import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet" | "cod";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

@Entity({ name: "payments" })
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  orderId!: string;

  @Column({ type: "varchar", length: 20 })
  paymentMethod!: PaymentMethod;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "varchar", length: 20, default: "pending" })
  status!: PaymentStatus;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ type: "json", nullable: true })
  paymentDetails?: string;

  @Column({ nullable: true })
  paymentDate?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  // Relationships
}
