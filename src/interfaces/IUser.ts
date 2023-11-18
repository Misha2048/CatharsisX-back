export default interface IUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    refresh_token?: string;
    email_verified: boolean;
    registered_at: Date;
    last_logged_at: Date;
};