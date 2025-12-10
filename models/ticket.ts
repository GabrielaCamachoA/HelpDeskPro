import mongoose, { Schema } from "mongoose";

const TicketSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open"
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" }, // agente opcional
  },
  { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
