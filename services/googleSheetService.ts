
import type { CartItem } from '../types';

interface OrderPayload {
  employeeName: string;
  employeeCode: string;
  customerCode: string;
  customerName: string;
  note: string;
  items: CartItem[];
}

export const postOrderToGoogleSheet = async (
  url: string,
  payload: OrderPayload
): Promise<{ status: string; message?: string }> => {
  try {
    await fetch(url, {
      method: 'POST',
      // By using 'no-cors', we send an opaque request. We cannot read the response,
      // but this is a robust way to bypass CORS issues when posting to a
      // Google Apps Script, which is our primary goal.
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        // Use text/plain to avoid a CORS preflight request.
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
    });

    // Because the request is 'opaque', we can't check the response status.
    // We assume success if the fetch() call itself doesn't throw a network error.
    return { status: 'success' };
  } catch (error) {
    console.error('Error posting to Google Sheet:', error);
    // This error now likely indicates a network failure (e.g., no internet) or a DNS issue,
    // rather than a CORS problem.
    return { status: 'error', message: `Không thể gửi đơn hàng. Vui lòng kiểm tra kết nối mạng và thử lại. Nếu vẫn không được, hãy kiểm tra lại URL Google Apps Script.` };
  }
};
