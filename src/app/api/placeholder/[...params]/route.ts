import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  const [widthStr, heightStr] = params.params;
  const width = parseInt(widthStr, 10);
  const height = parseInt(heightStr, 10);
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#F3F4F6"/>
      <rect x="${width/4}" y="${height/4}" width="${width/2}" height="${height/2}" fill="#D1D5DB"/>
      <text x="${width/2}" y="${height/2}" text-anchor="middle" dy=".3em" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="14">
        ${width}x${height}
      </text>
    </svg>
  `;
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
