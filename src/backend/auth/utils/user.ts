import { Response } from 'express';
import { SessionRequest } from './session';

// USER SESSION
export const getUserProfile = () => {
    return async (req: SessionRequest, res: Response) => {
        const user = {
            displayName: req.session.displayName,
            email: req.session.userName,
            firstName: req.session.firstName,
            groups: req.session.groups,
            identifier: req.session.upn,
            lastName: req.session.lastName,
        };
        res.status(200).send(user);
    };
};
