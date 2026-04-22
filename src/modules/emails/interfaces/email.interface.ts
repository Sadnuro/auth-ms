export interface IEmail {
  from?: string;
  to: string[];
  cc?: string[];
  subject: string;
  html: string;
}
