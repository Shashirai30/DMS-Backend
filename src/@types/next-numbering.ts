export interface NextNumbering {
  id: number
  category: string
  process: string
  year: number
  currentIndex: number
  lastNumber: string
  length: number
  docNumber: string
  status: number
  docId: string
  folder: string
}

export interface CreateNextNumberingRequest {
  category: string
  process: string
  year: number
  currentIndex: number
  length: number
  docId: string
  folder: string
  status: number
}

export interface UpdateNextNumberingRequest extends CreateNextNumberingRequest {
  id: number
}

export interface NextNumberingResponse {
  data: NextNumbering | NextNumbering[]
  message: string
  status: number
}
