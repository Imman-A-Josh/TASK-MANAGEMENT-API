import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDto(dtoClass: any) {

    return (req: Request, res: Response, next: NextFunction): void => {
        const dtoObj = plainToInstance(dtoClass, req.body || {});

        validate(dtoObj).then((errors) => {
            if (errors.length > 0) {
                const messages = errors.map(err => Object.values(err.constraints || {})).flat();
                res.status(400).json({ status: "fail", errors: messages });
                return;
            }

            next();
        });
    };
}
