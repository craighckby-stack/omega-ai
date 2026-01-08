model EncryptionKey {
  id          String   @id @default(cuid())
  data        String   @db.Text
  publicKey   String   @db.Text
  privateKey  String   @db.Text
  algorithm   String   @default("AES-256-GCM")
  created     Int
  expires     Int
  usage       String
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
}