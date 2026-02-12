import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getCities, getWeatherHandler } from "../controllers/weatherController.js";

/**
 * Router for weather-related endpoints
 */
export const weatherRoutes = express.Router();

weatherRoutes.get("/cities", getCities);
weatherRoutes.get("/", asyncHandler(getWeatherHandler));
