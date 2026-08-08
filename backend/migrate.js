const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Book = require("./models/Book");
const Member = require("./models/Member");

const MONGO_URI =
  "mongodb://127.0.0.1:27017/library_management";

const dbPath = path.join(
  __dirname,
  "..",
  "db.json"
);

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log(
      "Connected to MongoDB"
    );

    if (!fs.existsSync(dbPath)) {
      console.log(
        "db.json was not found."
      );

      process.exit();
    }

    const data = JSON.parse(
      fs.readFileSync(dbPath, "utf8")
    );

    // =====================================
    // BOOKS
    // =====================================

    if (data.books && data.books.length > 0) {

      for (const item of data.books) {

        const quantity =
          Number(item.quantity) || 1;

        const available =
          item.available !== undefined
            ? Number(item.available)
            : quantity;

        await Book.updateOne(
          {
            title: item.title,
            author: item.author,
          },
          {
            $set: {
              title: item.title,
              author: item.author,
              category:
                item.category || "General",
              isbn: item.isbn || "",
              quantity,
              available,
              status:
                item.status ||
                (available > 0
                  ? "Available"
                  : "Issued"),
            },
          },
          {
            upsert: true,
          }
        );
      }

      console.log(
        `${data.books.length} books migrated`
      );
    }

    // =====================================
    // MEMBERS
    // =====================================

    if (
      data.members &&
      data.members.length > 0
    ) {

      for (const item of data.members) {

        if (!item.email) {
          continue;
        }

        await Member.updateOne(
          {
            email: item.email.toLowerCase(),
          },
          {
            $set: {
              name: item.name,
              email:
                item.email.toLowerCase(),
              phone:
                item.phone || "",
              address:
                item.address || "",
              membershipType:
                item.membershipType ||
                "Regular",
              status:
                item.status || "Active",
            },
          },
          {
            upsert: true,
          }
        );
      }

      console.log(
        `${data.members.length} members migrated`
      );
    }

    console.log(
      "Migration completed successfully."
    );

    await mongoose.disconnect();

  } catch (error) {

    console.error(
      "Migration failed:",
      error
    );

    process.exit(1);
  }
}

migrate();