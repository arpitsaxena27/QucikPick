import mongoose from "mongoose";

const objectSchema = new mongoose.Schema(
      {
            storeName: { type: String, required: true },
            storeMap: {
                  public_id: {
                        type: String,
                  },
                  secure_url: {
                        type: String,
                  },
            },
            address: { type: String, required: true },
            retailerId: { type: String, required: true }, // Unique identifier for the retailer
            shelves: [
                  {
                        name: { type: String, required: true },
                        nid: { type: String, required: true },
                        area: { type: Number },
                        isConvex: { type: Boolean },
                        boundingBox: {
                              x: { type: Number },
                              y: { type: Number },
                              width: { type: Number },
                              height: { type: Number },
                        },
                        points: [
                              {
                                    x: { type: Number },
                                    y: { type: Number },
                              },
                        ],
                        products: [
                              {
                                    productName: {
                                          type: String,
                                          required: true,
                                    },
                                    quantity: {
                                          type: Number,
                                          required: true,
                                    },
                                    price: {
                                          type: Number,
                                          required: true,
                                    },
                                    imageUrl: {
                                          type: String,
                                          required: true,
                                    },
                              },
                        ],
                  },
            ],
      },
      { timestamps: true }
);

const Mart = mongoose.model("marts", objectSchema);
export default Mart;
