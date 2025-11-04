// Global type declaration for mongoose cache
declare global {
  var mongoose: any;
}

export interface Mumineen {
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
  google_maps_link?: string;
  musaed_name?: string;
  musaed_contact?: string;
  isDeleted?: boolean;
  verified?: boolean;
  verified_by?: string;
  verified_at?: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
