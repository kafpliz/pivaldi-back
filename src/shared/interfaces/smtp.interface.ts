export interface EmailConfig {
     host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}


export interface SendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}