const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require("path").join(__dirname, "../.env") });
const User = require("../models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await User.deleteMany({ role: "admin" }); // remove old admin if any
    const admin = await User.create({
      name: "Admin",
      email: "admin@docbook.com",
      password: "Admin@123",
      role: "admin",
      phone: "+1 000 000 0000",
      gender: "other",
      isActive: true,
    });
    console.log("✅ Admin created!");
    console.log("   Email   : admin@docbook.com");
    console.log("   Password: Admin@123");
    console.log("   ID      :", admin._id.toString());
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
