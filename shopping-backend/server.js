const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: "Laptop", price: 60000, category: "Electronics" },
  { id: 2, name: "Headphones", price: 2000, category: "Electronics" }
];

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find(item => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const { name, price, category } = req.body;
  if (!name || price === undefined || !category || Number(price) < 0) {
    return res.status(400).json({ message: "name, a non-negative price, and category are required" });
  }
  const product = {
    id: products.length ? Math.max(...products.map(item => item.id)) + 1 : 1,
    name: String(name).trim(),
    price: Number(price),
    category: String(category).trim()
  };
  products.push(product);
  res.status(201).json(product);
});

app.put("/api/products/:id", (req, res) => {
  const product = products.find(item => item.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  const { name, price, category } = req.body;
  if (name !== undefined) product.name = String(name).trim();
  if (price !== undefined) {
    if (Number(price) < 0 || Number.isNaN(Number(price))) {
      return res.status(400).json({ message: "price must be a non-negative number" });
    }
    product.price = Number(price);
  }
  if (category !== undefined) product.category = String(category).trim();
  res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  const [deleted] = products.splice(index, 1);
  res.json({ message: "Product deleted", product: deleted });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
