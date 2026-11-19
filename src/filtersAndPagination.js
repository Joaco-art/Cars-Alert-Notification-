import { carsCollection } from "./db.js";


const brands = new Set([
    "toyota", "volkswagen", "ford", "chevrolet", "honda", "nissan",
    "hyundai", "kia", "bmw", "mercedes", "mercedes-benz", "audi",
    "tesla", "subaru", "mazda"
]);

const MAX_PAGE_SIZE = 3;
const PAGE_SIZE = 3;

export async function getPaginatedCars(source = [], requestedPage = 1) {
  const list = await source;
  const allItems = Array.isArray(list) ? list : [];

  const effectivePageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, PAGE_SIZE));
  const totalCars = allItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCars / effectivePageSize));

  const parsedPage = parseInt(requestedPage, 10);
  const currentPage = Math.min(
    Math.max(1, Number.isNaN(parsedPage) ? 1 : parsedPage),
    totalPages
  );

  const skip = (currentPage - 1) * effectivePageSize;
  const cars = allItems.slice(skip, skip + effectivePageSize);

  return {
    cars,
    pagination: {
      currentPage,
      totalPages,
      totalCars,
      pageSize: effectivePageSize,
      hasMultiplePages: totalPages > 1,
      hasPrev: currentPage > 1,
      hasNext: currentPage < totalPages,
      prevPage: currentPage > 1 ? currentPage - 1 : 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : totalPages,
    },
  };
}
export async function getSearch(req, res) {
    const query = (req.query.q || "").trim();
    let filter = {};
    let detectedType = null; // 'year' | 'brand' | 'model'

    if (query) {
        const lowerQuery = query.toLowerCase();
        const isFourDigitYear = /^\d{4}$/.test(query);

        if (isFourDigitYear) {
            detectedType = "year";
            filter = { year: Number(query) };
        } else if (brands.has(lowerQuery)) {
            detectedType = "brand";
            filter = { brand: new RegExp(`^${escapeRegex(query)}$`, "i") };
        } else {
            detectedType = "model";
            const safeRegex = new RegExp(escapeRegex(query), "i");
            filter = {
                $or: [
                    { model: safeRegex },
                    { brand: safeRegex }
                ]
            };
        }
    }

    const matchedCars = await carsCollection.find(filter).toArray();
    const { cars, pagination } = await getPaginatedCars(matchedCars, req.query.page);

    const noResultsMessage = cars.length === 0
        ? (query
            ? `No se encontraron vehículos que coincidan con "${query}".`
            : "No hay vehículos disponibles en este momento.")
        : null;

    res.render("search", {
        cars,
        searchQuery: query,
        detectedType,
        noResultsMessage,
        pagination
    });
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}