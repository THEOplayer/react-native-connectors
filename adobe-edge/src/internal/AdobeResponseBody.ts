export interface AdobeResponse {
  status: number;
  body?: AdobeResponseBody;
}

export interface AdobeResponseBody {
  requestId: string;
  handle?: {
    type: string;
    payload: { [key: string]: any }[];
  }[];
}
