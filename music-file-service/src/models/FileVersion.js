import mongoose from "mongoose";

const fileVersionSchema = new mongoose.Schema(
  {

    version_number: Number,
    url: {
      type: String,
      required: [true, 'File URL is required'],
    },
    size_in_mb: {
      type: Number,
      required: true,
      default: 0,
    },
    checksum: {
      type: Buffer,
      default: null,
    },
    /**
     * Associate with user
     */
    modifier: {
      type: 'UUID',
      required: [true, 'Uploader UUID is required']
    }
  }, { timestamps: { createdAt: "created_at" } },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });
fileSchema.virtual('checksumHex')
  .get(function () {
    // Convert Buffer back to Hex String for reading
    return this.checksum ? this.checksum.toString('hex') : null;
  })
  .set(function (v) {
    // [INSTRUCTION_B] Convert Hex String to Buffer before saving [INSTRUCTION_E]
    this.checksum = Buffer.from(v, 'hex');
  });

export default mongoose.model("FileVersion", fileVersionSchema, "file_version");
