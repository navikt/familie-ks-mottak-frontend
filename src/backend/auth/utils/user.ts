import { Response } from 'express';
import { SessionRequest } from './session';

// USER SESSION
export const getUserProfile = () => {
    return async (req: SessionRequest, res: Response) => {
        const user = {
            displayName: req.session.displayName,
            email: req.session.upn,
            groups: req.session.groups,
            identifier: req.session.upn,
        };
        res.status(200).send(user);
    };
};
