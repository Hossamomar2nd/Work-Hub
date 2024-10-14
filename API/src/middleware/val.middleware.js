import { Types } from "mongoose";

export const objectIdValidation = (value, helper) => {
    if (Types.ObjectId.isValid(value)) return true;
    return helper.message("Invalid ObjectId");
}

export const validation = (Schema) => {
    return (req, res, next) => {
        const data = {...req.body, ...req.query}
        const validationResult = Schema.validate(data, {
            abortEarly: false,
        });
        if (validationResult.error) {
            return next(
                new Error(
                    validationResult.error.message,
                    { cause: 400 }
                )
            );
        }
        next();
    }
}

export const validateParams = () => {
    return (req, res, next) => {
        if(req.params.id !== ':id'){
            if(typeof req.params.id === 'string') {
                const id = req.params.id;
                const idCount = id.length;
                console.log(id);
                if(idCount >= 24) {
                    return next();
                }
                else {
                    return res.status(400).send("Id should not be less than 24 digits");
                }
            }
            else{
                return res.status(400).send("Id should be string");
            } 
        }
        else {
            console.log(req.params.id);
            return res.status(400).send("Id is required");
        }
    }
}


const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;

export const validatePassword = (password) => {
  return passwordPattern.test(password);
}

const valMiddleware = (Schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        const data = {...req.body}
        const validationResult = Schema.validate(data, { abortEarly: false });

        if (validationResult.error) {
            validationResult.error.details.forEach((errorDetail) => {
                validationErrors.push(errorDetail.message);
            });
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        }

        next();
    };
};

export default valMiddleware