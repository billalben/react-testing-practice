import { db } from "./db";

export const handlers = [
  ...db.product.toHandlers("rest"),
  ...db.category.toHandlers("rest"),
];

// import { http, HttpResponse } from "msw";
// import { products } from "./data";

// export const handlers = [
//   http.get("/categories", () => {
//     return HttpResponse.json([
//       { id: 1, name: "Electronics" },
//       { id: 2, name: "Books" },
//       { id: 3, name: "Clothing" },
//     ]);
//   }),

//   http.get("/products", () => {
//     return HttpResponse.json(products);
//   }),

//   http.get("/products/:id", (req) => {
//     const productId = parseInt(req.params.id as string);
//     const product = products.find((p) => p.id === productId);

//     if (!product) {
//       return HttpResponse.json(null, { status: 404 });
//     }

//     return HttpResponse.json(product);
//   }),
// ];
