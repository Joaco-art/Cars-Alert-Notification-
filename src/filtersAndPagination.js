import { carsCollection } from "./db.js";


const brands = new Set([
    "toyota", "volkswagen", "ford", "chevrolet", "honda", "nissan",
    "hyundai", "kia", "bmw", "mercedes", "mercedes-benz", "audi",
    "tesla", "subaru", "mazda"
]);

const MAX_PAGE_SIZE = 6;
const PAGE_SIZE = 6;

export async function getPaginatedCars(source = [], requestedPage = 1, pageSize = PAGE_SIZE) {
    const list = await source;
    const allItems = Array.isArray(list) ? list : [];

    const parsedSize = parseInt(pageSize, 10);
    const effectivePageSize = Math.min(
        MAX_PAGE_SIZE,
        Math.max(1, Number.isNaN(parsedSize) ? PAGE_SIZE : parsedSize)
    );

    const page = Math.max(1, parseInt(requestedPage, 10) || 1);
    const totalCars = allItems.length;
    const totalPages = Math.max(1, Math.ceil(totalCars / effectivePageSize));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * effectivePageSize;

    return allItems.slice(skip, skip + effectivePageSize);
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
    const cars = await getPaginatedCars(matchedCars, req.query.page, PAGE_SIZE);

    const totalCars = matchedCars.length;
    const totalPages = Math.max(1, Math.ceil(totalCars / PAGE_SIZE));
    const currentPage = Math.min(Math.max(1, parseInt(req.query.page, 10) || 1), totalPages);

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
        pagination: {
            currentPage,
            totalPages,
            totalCars,
            pageSize: PAGE_SIZE,
            hasMultiplePages: totalPages > 1,
            hasPrev: currentPage > 1,
            hasNext: currentPage < totalPages
        }
    });
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}