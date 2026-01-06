import { NextRequest, NextResponse } from 'next/server';
import { EncryptionSystem } from '@/lib/security/encryption';
import { BinaryProcessor } from '@/lib/security/binary-units';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'encrypt':
        return await handleEncrypt(data);
      case 'decrypt':
        return await handleDecrypt(data);
      case 'process':
        return await handleProcess(data);
      case 'generate-key':
        return await handleGenerateKey();
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Security API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleEncrypt(data: { text: string }) {
  const encryption = new EncryptionSystem();
  const key = encryption.generateKey();

  const encrypted = await encryption.encrypt(data.text, key);

  // Store encryption key in database
  await db.encryptionKey.create({
    data: {
      publicKey: key.toString('base64'),
      privateKey: key.toString('base64'),
      algorithm: 'AES-256-GCM',
      created: Date.now(),
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      usage: 'ENCRYPT',
      active: true,
    }
  });

  // Store encrypted packet
  await db.encryptedPacket.create({
    data: {
      data: encrypted.data,
      iv: encrypted.iv,
      tag: encrypted.tag,
      keyId: encrypted.keyId,
      timestamp: encrypted.timestamp,
    }
  });

  return NextResponse.json({
    success: true,
    encryptedPacket: encrypted,
    keyId: encrypted.keyId
  });
}

async function handleDecrypt(data: { encryptedPacket: any; keyId: string }) {
  const encryption = new EncryptionSystem();

  // Retrieve key from database
  const keyRecord = await db.encryptionKey.findUnique({
    where: { id: data.keyId }
  });

  if (!keyRecord) {
    return NextResponse.json(
      { error: 'Key not found' },
      { status: 404 }
    );
  }

  const key = Buffer.from(keyRecord.publicKey, 'base64');
  const decrypted = await encryption.decrypt(data.encryptedPacket, key);

  return NextResponse.json({
    success: true,
    decryptedData: decrypted
  });
}

async function handleProcess(data: { binary: string; unitType: string }) {
  const processor = new BinaryProcessor(data.unitType as any, {
    maxCycles: 1000,
    errorThreshold: 10,
    operationTimeout: 5000
  });

  const result = await processor.process(data.binary);

  // Store data packet
  await db.dataPacket.create({
    data: {
      packetType: 'INPUT',
      source: 'PROCESSOR',
      payload: result,
      size: data.binary.length,
      checksum: result.success ? 'valid' : 'invalid',
      processed: result.success,
    }
  });

  return NextResponse.json({
    success: result.success,
    result
  });
}

async function handleGenerateKey() {
  const encryption = new EncryptionSystem();
  const keyPair = await encryption.generateRSAKeyPair();

  await db.encryptionKey.create({
    data: {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      algorithm: 'RSA-4096',
      created: Date.now(),
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
      usage: 'ENCRYPT',
      active: true,
    }
  });

  return NextResponse.json({
    success: true,
    keyId: keyPair.publicKey.slice(0, 16),
    publicKey: keyPair.publicKey
  });
}
