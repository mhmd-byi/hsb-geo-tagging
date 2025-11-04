import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../../lib/mongodb';
import Mumineen from '../../../../models/Mumineen';
import { authOptions } from '@/lib/auth';

// PUT - Update a mumineen record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    await connectDB();

    const body = await request.json();
    const { its_id } = body;

    // Validate required fields
    if (!body.its_id || !body.full_name || !body.sabil_no) {
      return NextResponse.json(
        { success: false, error: 'ITS ID, Full Name, and Sabil No are required' },
        { status: 400 }
      );
    }

    // For users with 'user' role, only allow address updates
    if (session?.user?.role === 'user') {
      const getMumineen = await Mumineen.findOne({ its_id: its_id });
      
      if (!getMumineen) {
        return NextResponse.json(
          { success: false, error: 'Mumineen not found' },
          { status: 404 }
        );
      }

      // Check if it's a HOF record
      if (getMumineen.its_id !== getMumineen.hof_id) {
        return NextResponse.json(
          { success: false, error: 'You can only update head of family records' },
          { status: 403 }
        );
      }

      // Only allow address update for user role with verification
      const updatedMumineen = await Mumineen.findOneAndUpdate(
        { its_id: its_id },
        { 
          address: body.address,
          google_maps_link: body.google_maps_link,
          verified: true,
          verified_by: session.user.name || session.user.email || 'Unknown User',
          verified_at: new Date()
        },
        { new: true, runValidators: true }
      );

      // Update address and verification for all family members with same HOF
      await Mumineen.updateMany(
        { hof_id: getMumineen.hof_id },
        { 
          address: body.address,
          google_maps_link: body.google_maps_link,
          verified: true,
          verified_by: session.user.name || session.user.email || 'Unknown User',
          verified_at: new Date()
        }
      );

      return NextResponse.json({
        success: true,
        data: updatedMumineen,
        message: 'Address and Google Maps link updated successfully for all family members'
      });
    }

    // Admin users can update all fields
    const getMumineenAddress = await Mumineen.findOne({ its_id: its_id });
    const address = getMumineenAddress?.address;
    const googleMapsLink = getMumineenAddress?.google_maps_link;
    
    // Update all family members if address or Google Maps link changed
    if ((address && address !== body.address) || (googleMapsLink && googleMapsLink !== body.google_maps_link)) {
      const updateFields: any = {};
      if (address !== body.address) {
        updateFields.address = body.address;
      }
      if (googleMapsLink !== body.google_maps_link) {
        updateFields.google_maps_link = body.google_maps_link;
      }
      
      const updateAllMumineenAddress = await Mumineen.updateMany(
        { hof_id: body.hof_id }, 
        updateFields
      );
      
      if (!updateAllMumineenAddress) {
        return NextResponse.json(
          { success: false, error: 'Failed to update all mumineen records' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { success: true, message: 'All mumineen records updated successfully' },
          { status: 200 }
        );
      }
    }

    const updatedMumineen = await Mumineen.findOneAndUpdate(
      { its_id: its_id },
      {
        its_id: body.its_id,
        hof_id: body.hof_id,
        full_name: body.full_name,
        age: body.age,
        gender: body.gender,
        sabil_no: body.sabil_no,
        sector: body.sector,
        contact_no: body.contact_no,
        misaq: body.misaq,
        marital_status: body.marital_status,
        address: body.address,
        google_maps_link: body.google_maps_link,
      },
      { new: true, runValidators: true }
    );

    if (!updatedMumineen) {
      return NextResponse.json(
        { success: false, error: 'Mumineen not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMumineen,
      message: 'Mumineen updated successfully'
    });
  } catch (error) {
    console.error('Error updating mumineen:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update mumineen' },
      { status: 500 }
    );
  }
}

// GET - Get a single mumineen record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const mumineen = await Mumineen.findById(id);

    if (!mumineen) {
      return NextResponse.json(
        { success: false, error: 'Mumineen not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mumineen
    });
  } catch (error) {
    console.error('Error fetching mumineen:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mumineen' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a mumineen record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Only admin can delete
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only admins can delete records' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;
    const deletedMumineen = await Mumineen.findOneAndUpdate(
      { its_id: id },
      { isDeleted: true }
    );

    if (!deletedMumineen) {
      return NextResponse.json(
        { success: false, error: 'Mumineen not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mumineen deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mumineen:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete mumineen' },
      { status: 500 }
    );
  }
}
