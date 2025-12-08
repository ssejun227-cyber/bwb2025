/**
 * Confer Admin Server
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "..", "data", "content.json");
const DATA_FILE_EN = path.join(
  __dirname,
  "..",
  "pages",
  "en",
  "data",
  "content.json"
);
const UPLOAD_DIR = path.join(__dirname, "..", "assets", "images");

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (pathname.startsWith("/api/")) {
    handleAPI(req, res, pathname);
    return;
  }

  serveStaticFile(req, res, pathname);
});

function handleAPI(req, res, pathname) {
  // English content - GET
  if (pathname === "/api/content/en" && req.method === "GET") {
    try {
      const data = fs.readFileSync(DATA_FILE_EN, "utf8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to read content" }));
    }
    return;
  }

  // English content - PUT
  if (pathname === "/api/content/en" && req.method === "PUT") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        fs.writeFileSync(DATA_FILE_EN, JSON.stringify(data, null, 2), "utf8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to save content" }));
      }
    });
    return;
  }

  // Korean content - GET
  if (pathname === "/api/content" && req.method === "GET") {
    try {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to read content" }));
    }
    return;
  }

  // Korean content - PUT
  if (pathname === "/api/content" && req.method === "PUT") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to save content" }));
      }
    });
    return;
  }

  // Image upload
  if (pathname === "/api/upload" && req.method === "POST") {
    uploadImage(req, res);
    return;
  }

  // SEO generate
  if (pathname === "/api/generate-seo" && req.method === "POST") {
    generateSEO(req, res);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "API not found" }));
}

function uploadImage(req, res) {
  const contentType = req.headers["content-type"];

  if (!contentType || !contentType.includes("multipart/form-data")) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid content type" }));
    return;
  }

  const boundary = contentType.split("boundary=")[1];
  let body = Buffer.alloc(0);

  req.on("data", (chunk) => {
    body = Buffer.concat([body, chunk]);
  });

  req.on("end", () => {
    try {
      const parts = parseMultipart(body, boundary);
      const filePart = parts.find((p) => p.filename);

      if (!filePart) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No file uploaded" }));
        return;
      }

      const filename =
        Date.now() + "_" + filePart.filename.replace(/[^a-zA-Z0-9._-]/g, "");
      const filepath = path.join(UPLOAD_DIR, filename);

      fs.writeFileSync(filepath, filePart.data);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          filename: filename,
          path: "assets/images/" + filename,
        })
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to upload file" }));
    }
  });
}

function parseMultipart(body, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from("--" + boundary);

  let start = body.indexOf(boundaryBuffer) + boundaryBuffer.length + 2;

  while (start < body.length) {
    let end = body.indexOf(boundaryBuffer, start);
    if (end === -1) break;

    const part = body.slice(start, end - 2);
    const headerEnd = part.indexOf("\r\n\r\n");

    if (headerEnd !== -1) {
      const headers = part.slice(0, headerEnd).toString();
      const data = part.slice(headerEnd + 4);

      const filenameMatch = headers.match(/filename="([^"]+)"/);
      const nameMatch = headers.match(/name="([^"]+)"/);

      parts.push({
        name: nameMatch ? nameMatch[1] : null,
        filename: filenameMatch ? filenameMatch[1] : null,
        data: data,
      });
    }

    start = end + boundaryBuffer.length + 2;
  }

  return parts;
}

function generateSEO(req, res) {
  try {
    const content = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    const seo = content.seo || {};
    const baseUrl = seo.url || "https://example.com";

    const sitemap =
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>' +
      baseUrl +
      "/</loc>\n    <lastmod>" +
      new Date().toISOString().split("T")[0] +
      "</lastmod>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>" +
      baseUrl +
      "/pages/en/</loc>\n    <lastmod>" +
      new Date().toISOString().split("T")[0] +
      "</lastmod>\n    <priority>0.9</priority>\n  </url>\n</urlset>";

    const robots =
      "User-agent: *\nAllow: /\n\nSitemap: " + baseUrl + "/sitemap.xml";

    const projectRoot = path.join(__dirname, "..");
    fs.writeFileSync(path.join(projectRoot, "sitemap.xml"), sitemap, "utf8");
    fs.writeFileSync(path.join(projectRoot, "robots.txt"), robots, "utf8");

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, message: "SEO files generated" }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to generate SEO files" }));
  }
}

function serveStaticFile(req, res, pathname) {
  let filepath;

  // Main page
  if (pathname === "/") {
    filepath = path.join(__dirname, "..", "index.html");
  }
  // Admin - redirect /admin to /admin/ for proper relative path resolution
  else if (pathname === "/admin") {
    res.writeHead(301, { Location: "/admin/" });
    res.end();
    return;
  }
  // Admin main page
  else if (pathname === "/admin/") {
    filepath = path.join(__dirname, "admin", "index.html");
  }
  // Admin static files (css, js, etc.)
  else if (pathname.startsWith("/admin/")) {
    filepath = path.join(__dirname, "admin", pathname.replace("/admin/", ""));
  }
  // Photo gallery page
  else if (pathname === "/photo_kr" || pathname === "/photo_kr/") {
    filepath = path.join(__dirname, "..", "pages", "photo_kr", "index.html");
  } else if (pathname.startsWith("/photo_kr/")) {
    filepath = path.join(
      __dirname,
      "..",
      "pages",
      "photo_kr",
      pathname.replace("/photo_kr/", "")
    );
  }
  // Media page
  else if (pathname === "/media_kr" || pathname === "/media_kr/") {
    filepath = path.join(__dirname, "..", "pages", "media_kr", "index.html");
  } else if (pathname.startsWith("/media_kr/")) {
    filepath = path.join(
      __dirname,
      "..",
      "pages",
      "media_kr",
      pathname.replace("/media_kr/", "")
    );
  }
  // Other pages
  else if (pathname.startsWith("/pages/")) {
    const pagePath = pathname.replace("/pages/", "");
    if (pagePath.endsWith("/") || !path.extname(pagePath)) {
      const cleanPath = pagePath.replace(/\/$/, "");
      filepath = path.join(__dirname, "..", "pages", cleanPath, "index.html");
    } else {
      filepath = path.join(__dirname, "..", "pages", pagePath);
    }
  }
  // Static files from project root
  else {
    filepath = path.join(__dirname, "..", pathname);
  }

  // Check if file exists
  if (!fs.existsSync(filepath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found: " + pathname);
    return;
  }

  // Determine MIME type
  const ext = path.extname(filepath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || "application/octet-stream";

  // Serve file
  try {
    const data = fs.readFileSync(filepath);
    res.writeHead(200, { "Content-Type": mimeType });
    res.end(data);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server error");
  }
}

server.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log("   Confer Admin Server Started");
  console.log("========================================");
  console.log("");
  console.log("  Main:   http://localhost:" + PORT);
  console.log("  Admin:  http://localhost:" + PORT + "/admin/");
  console.log("");
});
