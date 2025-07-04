import { apiGetNextNumberingByDocId, apiUpdateNextNumberingIndex } from "@/services/NextNumberingService"
import type { NextNumbering } from "@/@types/next-numbering"

/**
 * Gets the next document number for a specific document ID and updates the index
 * @param docId The document ID to get the next number for
 * @returns The next document number or null if not found
 */
export const getNextDocumentNumber = async (docId: string): Promise<string | null> => {
  try {
    const response = await apiGetNextNumberingByDocId(docId)
    if (response.status === 200 && !Array.isArray(response.data)) {
      const numbering = response.data as NextNumbering

      // Update the index to get the next number
      await apiUpdateNextNumberingIndex(numbering.id)

      // Return the current document number before the update
      return numbering.docNumber
    }
  } catch (error) {
    console.error("Failed to get next document number:", error)
  }
  return null
}

/**
 * Formats a document number based on the provided parameters
 * @param process The process code (e.g., RKT)
 * @param folder The folder code (e.g., 00)
 * @param category The category code (e.g., 01)
 * @param year The year (e.g., 25 for 2025)
 * @param index The current index
 * @param length The total length of the number
 * @returns The formatted document number
 */
export const formatDocumentNumber = (
  process: string,
  folder: string,
  category: string,
  year: number,
  index: number,
  length: number,
): string => {
  const paddedIndex = String(index).padStart(length - 6, "0")
  return `${process}/${folder}/${category}-${year}${paddedIndex}`
}

/**
 * Generates a fallback document number if the numbering system fails
 * @returns A fallback document number with current timestamp
 */
export const generateFallbackNumber = (): string => {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const timestamp = now.getTime().toString().slice(-6)

  return `TMP/${month}/${day}-${year}${timestamp}`
}
