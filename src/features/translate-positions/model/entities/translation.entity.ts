import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "translations" })
export class TranslationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({ name: "source_text", type: "varchar" })
  declare sourceText: string;

  @Column({ name: "translated_text", type: "varchar" })
  declare translatedText: string;
}
