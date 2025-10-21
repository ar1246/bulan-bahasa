import { NextResponse } from 'next/server'
import { debugCacheState, updateContentSection, getContentSection } from '@/lib/content-server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const sectionKey = searchParams.get('sectionKey')

    console.log('🔍 DEBUG CACHE API:', { action, sectionKey })

    switch (action) {
      case 'state':
        const cacheState = debugCacheState()
        return NextResponse.json({
          success: true,
          action: 'state',
          cacheKeys: Array.from(cacheState.keys()),
          cacheSize: cacheState.size,
          cacheContents: Object.fromEntries(cacheState.entries())
        })

      case 'get':
        if (!sectionKey) {
          return NextResponse.json({ error: 'sectionKey is required for get action' }, { status: 400 })
        }
        const content = await getContentSection(sectionKey)
        return NextResponse.json({
          success: true,
          action: 'get',
          sectionKey,
          content
        })

      case 'update':
        if (!sectionKey) {
          return NextResponse.json({ error: 'sectionKey is required for update action' }, { status: 400 })
        }
        
        const testContent = {
          title: `Updated Title at ${new Date().toISOString()}`,
          subtitle: 'Real-time update test',
          description: 'This should appear immediately on the homepage',
          timestamp: Date.now()
        }

        const updateResult = await updateContentSection(
          sectionKey, 
          testContent, 
          'Test Section', 
          'debug-api'
        )

        // Get the updated content to verify
        const updatedContent = await getContentSection(sectionKey)

        return NextResponse.json({
          success: true,
          action: 'update',
          sectionKey,
          updateResult,
          updatedContent,
          testContent
        })

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: state, get, or update' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Debug cache API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}