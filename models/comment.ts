import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
