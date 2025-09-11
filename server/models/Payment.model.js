import { model, Schema } from "mongoose";

const paymentDetailsSchema = new Schema(
      {
            razorpay_payment_id: {
                  type: String,
                  required: true,
            },
            razorpay_order_id: {
                  type: String,
                  required: true,
            },
            razorpay_signature: {
                  type: String,
                  required: true,
            },
            amount: {
                  type: Number,
                  required: true,
            },
            billPdf: {
                  secure_url: {
                        type: String,
                        required: false,
                        trim: true,
                        default: null,
                  },
                  public_id: {
                        type: String,
                        required: false,
                        trim: true,
                        default: null,
                  },
            },
      },
      {
            timestamps: true,
      }
);

const paymentSchema = new Schema(
      {
            martId: {
                  type: Schema.Types.ObjectId,
                  ref: "Mart",
                  required: true,
            },
            retailerId: {
                  type: String,
                  required: true,
            },
            payments: [paymentDetailsSchema],
      },
      {
            timestamps: true,
      }
);

const Payment = model("Payment", paymentSchema);

export default Payment;
