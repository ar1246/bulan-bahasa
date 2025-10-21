import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔥 Simple test API called at:', new Date().toISOString());
  
  return NextResponse.json({
    success: true,
    message: 'Simple test working!',
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url
  });
}