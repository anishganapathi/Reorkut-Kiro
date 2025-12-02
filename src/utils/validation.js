// File validation utilities for photo uploads and album management

/**
 * Validates if a file type is a valid image format
 * @param {string} fileType - The MIME type of the file (e.g., 'image/jpeg')
 * @returns {boolean} - True if valid image type, false otherwise
 */
export const isValidImageType = (fileType) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    return validTypes.includes(fileType.toLowerCase())
}

/**
 * Validates if a file size is within the allowed limit
 * @param {number} fileSize - The size of the file in bytes
 * @param {number} maxSizeMB - Maximum allowed size in megabytes (default: 5MB)
 * @returns {boolean} - True if file size is valid, false otherwise
 */
export const isValidFileSize = (fileSize, maxSizeMB = 5) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return fileSize <= maxSizeBytes
}

/**
 * Validates if a string contains only whitespace characters
 * @param {string} str - The string to validate
 * @returns {boolean} - True if string is only whitespace, false otherwise
 */
export const isWhitespaceOnly = (str) => {
    return typeof str === 'string' && str.trim().length === 0
}

/**
 * Validates a file for photo upload
 * @param {File} file - The file to validate
 * @returns {Object} - Object with isValid boolean and error message if invalid
 */
export const validatePhotoFile = (file) => {
    if (!file) {
        return { isValid: false, error: 'No file provided' }
    }

    if (!isValidImageType(file.type)) {
        return {
            isValid: false,
            error: 'Please select a valid image file (JPEG, PNG, GIF, or WEBP)'
        }
    }

    if (!isValidFileSize(file.size)) {
        return {
            isValid: false,
            error: 'Image file must be smaller than 5MB'
        }
    }

    return { isValid: true, error: null }
}

/**
 * Validates an album name
 * @param {string} name - The album name to validate
 * @returns {Object} - Object with isValid boolean and error message if invalid
 */
export const validateAlbumName = (name) => {
    if (!name) {
        return { isValid: false, error: 'Album name cannot be empty' }
    }

    if (isWhitespaceOnly(name)) {
        return {
            isValid: false,
            error: 'Album name must contain at least one non-whitespace character'
        }
    }

    return { isValid: true, error: null }
}
