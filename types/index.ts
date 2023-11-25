import { Document } from 'mongoose';

export interface ServerUser extends Document {
  username: false;
}
