import validator from 'validator';



export const validateEmail = (fieldName = 'email') => {
    return (req, res, next) => {
        const email = req.body[fieldName];

        if (!email) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} is required!`
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || !validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address!"
            });
        }

        req.body[fieldName] = validator.normalizeEmail(email);
        next();
    };
};


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

        const trimmedName = validator.trim(name);

        // 🌍 REAL WORLD FLEXIBLE - Accepts almost everything
        const nameRegex = /^[\p{L}\p{M}\p{N}\s'.,\-()&@#/]+$/u;
        
        // Just check length
        if (trimmedName.length < 2 || trimmedName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 100 characters"
            });
        }

        if (!nameRegex.test(trimmedName)) {
            return res.status(400).json({
                success: false,
                message: "Name contains invalid characters"
            });
        }

        // Block obvious malicious patterns only
        const dangerousPatterns = /<script|<iframe|javascript:|onerror=|onclick=|eval\(|DROP TABLE|DELETE FROM|INSERT INTO/i;
        if (dangerousPatterns.test(trimmedName)) {
            return res.status(400).json({
                success: false,
                message: "Invalid name format"
            });
        }

        req.body[fieldName] = trimmedName;
        next();
    };
};

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
            return next();
        }

        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid phone number"
            });
        }

        req.body[fieldName] = validator.escape(validator.trim(phone));
        next();
    };
};

/**
 * Validate verification code
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

        const codeRegex = /^\d{6}$/;
        if (!codeRegex.test(code)) {
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
            return next();
        }

        if (address.length < minLength || address.length > maxLength) {
            return res.status(400).json({
                success: false,
                message: `Address must be between ${minLength} and ${maxLength} characters`
            });
        }

        req.body[fieldName] = validator.escape(validator.trim(address));
        next();
    };
};

/**
 * Validate URL field
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
            return next();
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
 * Validate image upload
 */
export const validateImageUpload = (allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], maxSize = 5 * 1024 * 1024) => {
    return (req, res, next) => {
        if (!req.file) {
            return next();
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


export const validateId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName]
        if (!id) {
            return res.status(400).json({
                success: false,
                message: `${paramName} is required!`
            });
        }

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${paramName} format!`
            });
        }

        const parsedId = parseInt(id, 10);
        
        // MySQL INT max value: 2147483647
        if (parsedId <= 0 || parsedId > 2147483647) {
            return res.status(400).json({
                success: false,
                message: `${paramName} out of valid range!`
            });
        }
        req.params[paramName] = parsedId;


        next();
    };
};


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
            return next();
        }

        if (value.length < minLength || value.length > maxLength) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} must be between ${minLength} and ${maxLength} characters`
            });
        }

        req.body[fieldName] = validator.escape(validator.trim(value));
        next();
    };
};


//ORDER VALIDATOR


export const validateOrderCreation = () => {
    return (req, res, next) => {
        const { 
            amount,
            customer_name,
            phone_number, 
            shipping_address,
            delivery_company ,
            discount_amount = 0,
            cart,
            payment_method = "khqr"
        } = req.body;

        if (!customer_name || !phone_number || !delivery_company || !shipping_address || !amount) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided!"
            });
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0 || amountNum > 999999.99) {
            return res.status(400).json({
                success: false,
                message: "Amount must be between 0.01 and 999999.99!"
            });
        }


        
        
        const validCompanies = ["Vireak Buntham", "J&T", 'Phnom Penh delivery'];
        console.log(validCompanies.includes(delivery_company) ? "Yes" : "No");

        if (!validCompanies.includes(delivery_company)) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery company!"
            });
        }

        if (discount_amount !== undefined && discount_amount !== null && discount_amount !== '') {
            const discountNum = parseFloat(discount_amount);
            if (isNaN(discountNum) || discountNum < 0 || discountNum > 99999.99) {
                return res.status(400).json({
                    success: false,
                    message: "Discount amount must be between 0 and 99999.99!"
                });
            }
        }



        
      
        if (!cart) {
            return res.status(400).json({
                success: false,
                message: "Cart is required!"
            });
        }

        let parsedCart = [];
        try {
            parsedCart = typeof cart === 'string' ? JSON.parse(cart) : cart;
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid cart format!"
            });
        }

        if (!Array.isArray(parsedCart) || parsedCart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart cannot be empty!"
            });
        }

        for (let i = 0; i < parsedCart.length; i++) {

            const item = parsedCart[i];

            if (!item.id || !item.quantity || !item.price || !item.name ) {
                return res.status(400).json({
                    success: false,
                    message: `Cart item ${i + 1} is missing required fields!`
                });
            }
            

            if (!/^\d+$/.test(String(item.id)) || parseInt(item.id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Cart item ${i + 1} has invalid product ID!`
                });
            }
            
            // Validate quantity (1-1000)
            const qty = parseInt(item.quantity);
            if (isNaN(qty) || qty < 1 || qty > 1000) {
                return res.status(400).json({
                    success: false,
                    message: `Cart item ${i + 1} quantity must be 1-1000!`
                });
            }
            
            // Validate price
            const price = parseFloat(item.price);
            if (isNaN(price) || price <= 0 || price > 999999.99) {
                return res.status(400).json({
                    success: false,
                    message: `Cart item ${i + 1} has invalid price!`
                });
            }
        }

       

        const addressTrimmed = shipping_address.trim();
        if (addressTrimmed.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Shipping address must be between 10 and 500 characters!"
            });
        }

        const suspiciousPatterns = /<script|javascript:|onerror=|onclick=|<iframe|eval\(|DROP TABLE|INSERT INTO|DELETE FROM/i;
        if (suspiciousPatterns.test(addressTrimmed)) {
            return res.status(400).json({
                success: false,
                message: "Invalid characters in shipping address!"
            });
        }

        // 3. Allow only safe characters (letters, numbers, common punctuation, Khmer characters)
        const addressPattern = /^[\p{L}\p{N}\s,.\-#/()\u1780-\u17FF]+$/u;
        if (!addressPattern.test(addressTrimmed)) {
            return res.status(400).json({
                success: false,
                message: "Shipping address contains invalid characters!"
            });
        }

        const validMethods = ["cod", "paypal", "credit_card", "khqr"];

        if (!validMethods.includes(payment_method)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method!"
            });
        }


        req.body.shipping_address = addressTrimmed;

        // 8. Store sanitized values
        req.body.shipping_address = addressTrimmed;
        req.body.discount_amount = discount_amount;
        req.body.payment_method = payment_method;
        req.body.amount = amountNum;
        req.body.delivery_company = delivery_company;
        req.body.cart = parsedCart;
        
        console.log('📦 Full Request Body:', req.body);


        next();
    };
};


export const validateQrMd5 = (fieldName = 'qr_md5') => {
    return (req, res, next) => {
        const qrMd5 = req.body[fieldName];

        if (!qrMd5) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} is required!`
            });
        }

        // MD5 hash is 32 hexadecimal characters
        const md5Regex = /^[a-f0-9]{32}$/i;
        if (!md5Regex.test(qrMd5)) {
            return res.status(400).json({
                success: false,
                message: "Invalid QR MD5 format!"
            });
        }

        req.body[fieldName] = qrMd5.toLowerCase();
        next();
    };
};


export const validateAmount = (fieldName = 'amount', minAmount = 0.01, maxAmount = 999999.99, required = true) => {
    return (req, res, next) => {
        const amount = req.body[fieldName];

        if (!amount && amount !== 0) {
            if (required) {
                return res.status(400).json({
                    success: false,
                    message: `${fieldName} is required!`
                });
            }
            return next();
        }

        const amountNum = parseFloat(amount);
        
        if (isNaN(amountNum)) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} must be a valid number!`
            });
        }

        if (amountNum < minAmount || amountNum > maxAmount) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} must be between ${minAmount} and ${maxAmount}!`
            });
        }

        // Check for maximum 2 decimal places
        if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} can have maximum 2 decimal places!`
            });
        }

        req.body[fieldName] = amountNum;
        next();
    };
};







/**
 * Sanitize query parameters
 */
export const sanitizeQuery = () => {
    return (req, res, next) => {
        if (req.query) {
            Object.keys(req.query).forEach(key => {
                if (typeof req.query[key] === 'string') {
                    req.query[key] = validator.escape(validator.trim(req.query[key]));
                }
            });
        }
        next();
    };
};

/**
 * Sanitize body parameters
 */
export const sanitizeBody = () => {
    return (req, res, next) => {
        if (req.body) {
            Object.keys(req.body).forEach(key => {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = validator.escape(validator.trim(req.body[key]));
                }
            });
        }
        next();
    };
};