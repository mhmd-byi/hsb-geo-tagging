import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import GeoTag from '../../../../models/GeoTag';
import { UpdateGeoTagData } from '../../../../lib/types';

// GET - Fetch a specific geo tag by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const geotag = await GeoTag.findById(params.id);
    
    if (!geotag) {
      return NextResponse.json(
        { success: false, error: 'Geo tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: geotag
    });
  } catch (error) {
    console.error('Error fetching geo tag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch geo tag' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific geo tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body: UpdateGeoTagData = await request.json();
    
    const geotag = await GeoTag.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!geotag) {
      return NextResponse.json(
        { success: false, error: 'Geo tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: geotag
    });
  } catch (error) {
    console.error('Error updating geo tag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update geo tag' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific geo tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const geotag = await GeoTag.findByIdAndDelete(params.id);
    
    if (!geotag) {
      return NextResponse.json(
        { success: false, error: 'Geo tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Geo tag deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting geo tag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete geo tag' },
      { status: 500 }
    );
  }
}
