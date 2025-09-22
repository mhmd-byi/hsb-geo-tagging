import mongoose, { Schema, Document } from 'mongoose';

export interface IMumineen extends Document {
  _id: string;
  its_id: number;
  hof_id?: number;
  full_name: string;
  age?: number;
  gender?: string;
  sabil_no: number;
  sector?: string;
  contact_no?: string;
  misaq?: string;
  marital_status?: string;
  address?: string;
  musaed_name?: string;
  musaed_contact?: string;
}

const MumineenSchema = new Schema<IMumineen>({
  its_id: { type: Number, required: true },
  hof_id: { type: Number },
  full_name: { type: String, required: true, trim: true },
  age: { type: Number, min: 0, max: 150 },
  gender: { type: String, trim: true },
  sabil_no: { type: Number, required: true, unique: true },
  sector: { type: String, trim: true },
  contact_no: { type: String, trim: true },
  misaq: { type: String, trim: true },
  marital_status: { type: String, trim: true },
  address: { type: String, trim: true },
  musaed_name: { type: String, trim: true },
  musaed_contact: { type: String, trim: true }
}, {
  timestamps: false, // Since the collection doesn't have createdAt/updatedAt
  collection: 'mumineens' // Explicitly specify the collection name
});

// Create indexes for better query performance
MumineenSchema.index({ sabil_no: 1 });
MumineenSchema.index({ its_id: 1 });
MumineenSchema.index({ hof_id: 1 });
MumineenSchema.index({ full_name: 'text' });
MumineenSchema.index({ sector: 1 });

export default mongoose.models.Mumineen || mongoose.model<IMumineen>('Mumineen', MumineenSchema);
