import mongoose from "mongoose";

// Define a subdocument schema for stops
const stopSchema = new mongoose.Schema({
  time: { type: String },     
  location: { type: String } 
}, { _id: false }); 

// Main BusRoute schema
const busRouteSchema = new mongoose.Schema({
  routeNo: { type: String, required: true },   
  date: { type: Date, required: true },        
  stops: [stopSchema]                          
}, { timestamps: true });

export default mongoose.model("BusRoute", busRouteSchema);
