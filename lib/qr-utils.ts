import { createHmac } from 'crypto'
import QRCode from 'qrcode'

const QR_SECRET = process.env.QR_SECRET || 'turf-booking-qr-secret-key'

export interface QRCodeData {
  bookingId: string
  timestamp: number
  hash: string
}

export async function generateQRCode(bookingId: string): Promise<string> {
  const timestamp = Date.now()
  const hash = createHmac('sha256', QR_SECRET)
    .update(`${bookingId}-${timestamp}`)
    .digest('hex')

  const data: QRCodeData = {
    bookingId,
    timestamp,
    hash,
  }

  const qrDataString = JSON.stringify(data)
  const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
    errorCorrectionLevel: 'H',
    width: 300,
    margin: 2,
  })

  return qrCodeDataURL
}

export function verifyQRCode(qrData: string): QRCodeData | null {
  try {
    const data: QRCodeData = JSON.parse(qrData)
    
    // Verify hash
    const expectedHash = createHmac('sha256', QR_SECRET)
      .update(`${data.bookingId}-${data.timestamp}`)
      .digest('hex')

    if (data.hash !== expectedHash) {
      return null
    }

    // QR code is valid for 24 hours
    const expirationTime = 24 * 60 * 60 * 1000
    if (Date.now() - data.timestamp > expirationTime) {
      return null
    }

    return data
  } catch {
    return null
  }
}
