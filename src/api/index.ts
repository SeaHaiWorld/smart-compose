import { SmartComposeResponse } from '../types';
import sendXMLRequest from './request';

export const fetchSmartCompletion = (
  text: string,
): Promise<SmartComposeResponse> =>
  sendXMLRequest('http://localhost:8000/api/smartCompose', 'POST', { text });
