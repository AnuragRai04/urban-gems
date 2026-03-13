const mongoose = require("mongoose");
const Place = require("../models/place");
const User = require("../models/user"); // <--- Added the User model

mongoose.connect("mongodb://localhost:27017/urban-gems", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  // Clear out the old broken data and any old users
  await Place.deleteMany({});
  await User.deleteMany({});

  // Create a REAL user so the show page doesn't crash!
  const user = new User({ email: "anurag@example.com", username: "anurag" });
  const registeredUser = await User.register(user, "password");

  const seedPlaces = [
    {
      author: registeredUser._id, // <--- Using the real user ID we just created
      title: "Hidden Ghat Steps",
      location: "Phulwariya, Varanasi, Uttar Pradesh",
      geometry: { type: "Point", coordinates: [82.9903, 25.3176] },
      description:
        "Hardly anyone comes to this specific section of the steps. The sunset here reflects perfectly on the river, and it is completely quiet away from the main crowd.",
      entryFee: 0,
      category: "Views",
      bestTime: "6:00 PM",
      images: [
        {
          url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1000",
          filename: "urban-gems/varanasi-sunset",
        },
      ],
    },
    {
      author: registeredUser._id,
      title: "Old Town Study Nook",
      location: "Cantonment, Varanasi, Uttar Pradesh",
      geometry: { type: "Point", coordinates: [82.9739, 25.3333] },
      description:
        "A tiny, almost invisible cafe tucked in an alley. They have fast Wi-Fi, great cold coffee, and play lo-fi music all day. Perfect for coding or reading.",
      entryFee: 0,
      category: "Study",
      bestTime: "Afternoons",
      images: [
        {
          url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1000",
          filename: "urban-gems/study-cafe",
        },
      ],
    },
    {
      author: registeredUser._id,
      title: "Midnight Maggie Point",
      location: "Civil Lines, Jabalpur, Madhya Pradesh",
      geometry: { type: "Point", coordinates: [79.9339, 23.1815] },
      description:
        "Just a guy with a cart, but he makes the absolute best spicy Maggie and ginger tea in the city. Open way past midnight when everything else is closed.",
      entryFee: 40,
      category: "Food",
      bestTime: "Late Night",
      images: [
        {
          url: "https://images.unsplash.com/photo-1606843046080-45bf1a2ae58e?auto=format&fit=crop&q=80&w=1000",
          filename: "urban-gems/street-food",
        },
      ],
    },
    {
      author: registeredUser._id,
      title: "Bhedaghat Marble Rocks Overlook",
      location: "Bhedaghat, Jabalpur, Madhya Pradesh",
      geometry: { type: "Point", coordinates: [79.7997, 23.1294] },
      description:
        "Instead of taking the main tourist boats, there is a small trail on the south side that leads up to a cliff. The view of the river cutting through the marble is insane.",
      entryFee: 20,
      category: "Chill spots",
      bestTime: "Early Morning",
      images: [
        {
          url: "https://images.unsplash.com/photo-1610858593859-00e9fcb9bb85?auto=format&fit=crop&q=80&w=1000",
          filename: "urban-gems/marble-rocks",
        },
      ],
    },
  ];

  for (let spot of seedPlaces) {
    const place = new Place(spot);
    await place.save();
  }
};

seedDB().then(() => {
  console.log("Database seeded successfully with Urban Gems!");
  mongoose.connection.close();
});
