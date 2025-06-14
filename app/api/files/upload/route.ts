import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/features/(auth)/auth';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Set maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Handle file uploads for the chat interface
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access. Please log in to upload files.' },
        { status: 401 }
      );
    }

    // Parse form data with file
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the 10MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename to prevent collisions
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const pathname = `/uploads/${uniqueFilename}`;
    
    // Instead of physically storing files (which would require more server-side setup),
    // we'll create a URL that represents the file for this demo
    // In a production app, you'd store files in S3, Cloudinary, or similar storage service
    
    // Create a blob URL for use in the frontend
    const url = pathname;

    return NextResponse.json({
      url,
      pathname: file.name, // Original filename for display
      contentType: file.type,
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
