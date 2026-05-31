/**
 * Making request to Yandex.Disk API
 * @module ya-disk/request
 */

const cleanQuery = (query) => {
  if (!query) {
    return null;
  }

  const cleaned = Object.fromEntries(
    Object.entries(query).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );

  return Object.keys(cleaned).length ? cleaned : null;
};

/**
 * @typedef ApiResponse
 * @type {object}
 * @prop {object} data Response payload
 * @prop {number} status Response status code
 */

/**
 * Making request to API, parsing answers, handling errors
 * @param {object} options Request parameters
 * @param {string} options.url URL to request
 * @param {string} options.token OAuth token
 * @param {string} [options.method='GET'] Request type: POST, GET, etc.
 * @param {object} [options.query=null] Object with query params
 * @param {object} [options.data=null] Object with data params
 * @returns {Promise<ApiResponse|Error>} Promise to be resolved on request complete
 */
const request = async ({
  url,
  token,
  method = 'GET',
  query = null,
  data = null
}) => {
  const requestUrl = new URL(url);
  const cleanedQuery = cleanQuery(query);

  if (cleanedQuery) {
    for (const [key, value] of Object.entries(cleanedQuery)) {
      requestUrl.searchParams.set(key, value);
    }
  }

  const res = await fetch(requestUrl, {
    method,
    headers: {
      Authorization: `OAuth ${token}`
    },
    ...(data ? { body: JSON.stringify(data) } : {})
  });

  const text = await res.text();
  let parsedData;

  try {
    parsedData = text === '' ? null : JSON.parse(text);
  } catch {
    throw new Error(
      `Unexpected response (status ${res.status}): ${text.slice(0, 200)}`
    );
  }

  if (res.ok) {
    return { data: parsedData, status: res.status };
  }

  const e = new Error(
    parsedData?.description ?? `Request failed with status ${res.status}`
  );
  e.name = parsedData?.error ?? 'ApiError';
  throw e;
};

export const get = (options) =>
  requestApi.request({ ...options, method: 'GET' });
export const post = (options) =>
  requestApi.request({ ...options, method: 'POST' });
export const put = (options) =>
  requestApi.request({ ...options, method: 'PUT' });
export const patch = (options) =>
  requestApi.request({ ...options, method: 'PATCH' });
const deleteRequest = (options) =>
  requestApi.request({ ...options, method: 'DELETE' });
export { deleteRequest as delete };

export const requestApi = {
  request,
  get,
  post,
  put,
  patch,
  delete: deleteRequest
};
