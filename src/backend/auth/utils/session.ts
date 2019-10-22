import cookieParser from 'cookie-parser';
import { Request } from 'express';
import session from 'express-session';
import { PassportStatic } from 'passport';

export type SessionRequest = Request & {
    session: Express.Session;
    sessionID: string;
};

export default (app: any, passport: PassportStatic) => {
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.set('trust proxy', 1);

    app.use(
        session({
            name: 'familie-ks-mottak',
            resave: false,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET,
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
};
