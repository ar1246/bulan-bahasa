import { NextResponse } from 'next/server'
import { updateContentSection, getContentSection } from '@/lib/content-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sectionKey, content, title, updatedBy } = body

    if (!sectionKey || !content) {
      return NextResponse.json({ 
        error: 'sectionKey and content are required' 
      }, { status: 400 })
    }

    console.log('🔧 DEBUG CUSTOM: Updating content with custom structure', { sectionKey, content })

    const updateResult = await updateContentSection(
      sectionKey, 
      content, 
      title || 'Custom Section', 
      updatedBy || 'debug-custom'
    )

    // Get the updated content to verify
    const updatedContent = await getContentSection(sectionKey)

    return NextResponse.json({
      success: true,
      sectionKey,
      updateResult,
      updatedContent,
      originalContent: content
    })

  } catch (error) {
    console.error('Debug custom API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}