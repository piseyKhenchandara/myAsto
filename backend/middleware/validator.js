import validator from 'validator';

// ============================================
// HELPER FUNCTIONS (NOT MIDDLEWARE)
// ============================================

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && validator.isEmail(email);
};

const isStrongPassword = (password) => {
    return password.length >= 8;
};

const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
    return nameRegex.test(name);
};

const isValidPhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
};

const isValidCode = (code) => {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return validator.escape(validator.trim(input));
};


// ============================================
// REUSABLE VALIDATION MIDDLEWARES
// ============================================

/**
 * Validate required fields
 * Usage: validateRequired(['email', 'password', 'name'])
 */
export const validateRequired = (fields) => {
    return (req, res, next) => {
        const missingFields = [];
        
        fields.forEach(field => {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        next();
    };
};


/**
 * Validate email field
 * Usage: validateEmail('email')
 */
export const validateEmail = (fieldName = 'email') => {
    return (req, res, next) => {
        const email = req.body[fieldName];

        if (!email) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} is required!`
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address!"
            });
        }

        // Sanitize and normalize email
        req.body[fieldName] = validator.normalizeEmail(email);
        
        next();
    };
};


/**
 * Validate password field
 * Usage: validatePassword('password', 8)
 */
export const validatePassword = (fieldName = 'password', minLength = 8) => {
    return (req, res, next) => {
        const password = req.body[fieldName];

        if (!password) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} is required!`
            });
        }

        if (minLength && password.length < minLength) {
            return res.status(400).json({
                success: false,
                message: `Password must be at least ${minLength} characters long`
            });
        }

        next();
    };
};


/**
 * Validate name field
 * Usage: validateName('name')
 */
export const validateName = (fieldName = 'name', required = true) => {
    return (req, res, next) => {
        const name = req.body[fieldName];

        if (!name) {
            if (required) {
                return res.status(400).json({
                    success: false,
                    message: `${fieldName} is required!`
                });
            }
            return next();
        }

        if (!isValidName(name)) {
            return res.status(400).json({
                success: false,
                message: "Name must be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes"
            });
        }

        // Sanitize name
        req.body[fieldName] = sanitizeInput(name);

        next();
    };
};


/**
 * Validate phone field (optional)
 * Usage: validatePhone('phone', false) // not required
 * Usage: validatePhone('phone', true)  // required
 */
export const validatePhone = (fieldName = 'phone', required = false) => {
    return (req, res, next) => {
        const phone = req.body[fieldName];

        if (!phone) {
            if (required) {
                return res.status(400).json({
                    success: false,
                    message: `${fieldName} is required!`
                });
            }
            return next(); // Optional, skip validation
        }

        if (!isValidPhone(phone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid phone number"
            });
        }

        // Sanitize phone
        req.body[fieldName] = sanitizeInput(phone);

        next();
    };
};


/**
 * Validate verification code
 * Usage: validateCode('code')
 */
export const validateCode = (fieldName = 'code') => {
    return (req, res, next) => {
        const code = req.body[fieldName];

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Verification code is required!"
            });
        }

        if (!isValidCode(code)) {
            return res.status(400).json({
                success: false,
                message: "Verification code must be 6 digits"
            });
        }

        next();
    };
};


/**
 * Validate address field
 * Usage: validateAddress('address', 5, 200, false)
 */
export const validateAddress = (fieldName = 'address', minLength = 5, maxLength = 200, required = false) => {
    return (req, res, next) => {
        const address = req.body[fieldName];

        if (!address) {
            if (required) {
                return res.status(400).json({
                    success: false,
                    message: `${fieldName} is required!`
                });
            }
            return next(); // Optional, skip validation
        }

        if (address.length < minLength || address.length > maxLength) {
            return res.status(400).json({
                success: false,
                message: `Address must be between ${minLength} and ${maxLength} characters`
            });
        }

        // Sanitize address
        req.body[fieldName] = sanitizeInput(address);

        next();
    };
};


/**
 * Validate URL field
 * Usage: validateUrl('photoUrl', false)
 */
export const validateUrl = (fieldName, required = false) => {
    return (req, res, next) => {
        const url = req.body[fieldName];

        if (!url) {
            if (required) {
                return res.status(400).json({
                    success: false,
                    message: `${fieldName} is required!`
                });
            }
            return next(); // Optional, skip validation
        }

        if (!validator.isURL(url, { protocols: ['http', 'https'] })) {
            return res.status(400).json({
                success: false,
                message: `Invalid URL for ${fieldName}`
            });
        }

        next();
    };
};


/**
 * Validate file upload (images)
 * Usage: validateImageUpload(['image/jpeg', 'image/png'], 5 * 1024 * 1024)
 */
export const validateImageUpload = (allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], maxSize = 5 * 1024 * 1024) => {
    return (req, res, next) => {
        if (!req.file) {
            return next(); // No file uploaded, skip validation
        }

        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: `Only ${allowedTypes.join(', ')} files are allowed`
            });
        }

        if (req.file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: `File size must not exceed ${maxSize / (1024 * 1024)}MB`
            });
        }

        next();
    };
};


/**
 * Validate ID parameter
 * Usage: validateId('id') or validateId('userId')
 */
export const validateId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];

        if (!id || isNaN(id) || parseInt(id) <= 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${paramName}`
            });
        }

        next();
    };
};


/**
 * Validate string field with custom rules
 * Usage: validateString('username', 3, 20, true)
 */
export const validateString = (fieldName, minLength, maxLength, required = true) => {
    return (req, res, next) => {
        const value = req.body[fieldName];

        if (!value) {
            if (required) {
                return res.status(400).json({
                    success: false,
                    message: `${fieldName} is required!`
                });
            }
            return next(); // Optional, skip validation
        }

        if (value.length < minLength || value.length > maxLength) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} must be between ${minLength} and ${maxLength} characters`
            });
        }

        // Sanitize input
        req.body[fieldName] = sanitizeInput(value);

        next();
    };
};


/**
 * Validate number field
 * Usage: validateNumber('price', 0, 10000, true)
 */
export const validateNumber = (fieldName, min = 0, max = Infinity, required = true) => {
    return (req, res, next) => {
        const value = req.body[fieldName];

        if (value === undefined || value === null || value === '') {
            if (required) {
                return res.status(400).json({
                    success: false,
                    message: `${fieldName} is required!`
                });
            }
            return next(); // Optional, skip validation
        }

        const numValue = Number(value);

        if (isNaN(numValue)) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} must be a valid number`
            });
        }

        if (numValue < min || numValue > max) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} must be between ${min} and ${max}`
            });
        }

        next();
    };
};


/**
 * Sanitize all query parameters
 * Usage: sanitizeQuery()
 */
export const sanitizeQuery = () => {
    return (req, res, next) => {
        if (req.query) {
            Object.keys(req.query).forEach(key => {
                if (typeof req.query[key] === 'string') {
                    req.query[key] = sanitizeInput(req.query[key]);
                }
            });
        }
        next();
    };
};


/**
 * Sanitize all body parameters
 * Usage: sanitizeBody()
 */
export const sanitizeBody = () => {
    return (req, res, next) => {
        if (req.body) {
            Object.keys(req.body).forEach(key => {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = sanitizeInput(req.body[key]);
                }
            });
        }
        next();
    };
};