import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Mumineen from '../../../../models/Mumineen';

// PUT - Update a mumineen record
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { id } = params;

    // Validate required fields
    if (!body.its_id || !body.full_name || !body.sabil_no) {
      return NextResponse.json(
        { success: false, error: 'ITS ID, Full Name, and Sabil No are required' },
        { status: 400 }
      );
    }

    // Check if sabil_no already exists for a different record
    if (body.sabil_no) {
      const existingMumineen = await Mumineen.findOne({
        sabil_no: body.sabil_no,
        _id: { $ne: id }
      });

      if (existingMumineen) {
        return NextResponse.json(
          { success: false, error: 'Sabil number already exists' },
          { status: 400 }
        );
      }
    }

    const updatedMumineen = await Mumineen.findByIdAndUpdate(
      id,
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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const deletedMumineen = await Mumineen.findByIdAndDelete(id);

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
