export interface SmartComposeResponse {
  text: string;
  completion: string;
}

export interface XMLRequestError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export type XmlMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
