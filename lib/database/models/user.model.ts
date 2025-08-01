import { model, models, Schema } from "mongoose";

export interface UUser extends Document {
    clerkId:string;
    email: string;
    username: string;
    photo: string;
    firstName: string;
    lastName: string;
    planId: string;
    creditBalance: string;
}

const UserSchema = new Schema({
  clerkId: { 
    type: String, 
    required: true,
    unique: true,
},
    
  email: { 
    type: String, 
    required: true,
    unique: true,
},
    
  username: { 
    type: String, 
    required: true,
    unique: true,
},
    
  photo: { 
    type: String, 
    required: true,
},
    
  firstName: { 
    type: String,
},
    
  lastName: { 
    type: String,
},
    
  planId: { 
    type: Number,
    default: 1,
},
    
  creditBalance: { 
    type: Number,
    default: 10,
},
    
});

const User = models?.User || model("User", UserSchema);

export default User;
