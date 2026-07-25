import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const MIME: Record<string, string> = {
  pdf: 'application/pdf',
  md: 'text/markdown',
  json: 'application/json',
}

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format')

  if (!format || !['pdf', 'md', 'json'].includes(format)) {
    return NextResponse.json({ error: 'Invalid format. Use pdf, md, or json.' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'public/cv', `cv.${format}`)

  try {
    const content = fs.readFileSync(filePath)
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': MIME[format],
        'Content-Disposition': `attachment; filename="cv.${format}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: `CV not available in ${format} format.` }, { status: 404 })
  }
}
