let mongoose = require("mongoose");
let initData = require("./data.js");
let listing = require("../Models/listings.js");


main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

let initDB = async () => {
//     await listing.deleteMany({});
//    initData.data = initData.data.map((obj) =>
//         ({ ...obj, owner: "669816738195dfd2b475c1f9" }))
    await listing.insertMany(initData.data);
    console.log(initData.data);
}


initDB();