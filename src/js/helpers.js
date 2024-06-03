import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

// returns a promise that will be rejected after a certain time
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Both fetch and json will return a promise.
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    // Creating a error manually
    // 'ok', 'message' and 'status' comes in response
    // The below line says that if the 'res.ok' is not true throw a new error with 'res.message' and 'res.status' as arguments for 'catch'
    if (!res.ok) throw new Error(`${res.message} ${res.status}`);
    return data; // Here, this 'data' is the resolved value of this promise('getJSON')
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     // Both fetch and json will return a promise.
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

//     const data = await res.json();

//     // Creating a error manually
//     // 'ok', 'message' and 'status' comes in response
//     // The below line says that if the 'res.ok' is not true throw a new error with 'res.message' and 'res.status' as arguments for 'catch'
//     if (!res.ok) throw new Error(`${res.message} ${res.status}`);
//     return data; // Here, this 'data' is the resolved value of this promise('getJSON')
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     // Both fetch and json will return a promise.
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

//     const data = await res.json();

//     // Creating a error manually
//     // 'ok', 'message' and 'status' comes in response
//     // The below line says that if the 'res.ok' is not true throw a new error with 'res.message' and 'res.status' as arguments for 'catch'
//     if (!res.ok) throw new Error(`${res.message} ${res.status}`);
//     return data; // Here, this 'data' is the resolved value of this promise('getJSON')
//   } catch (err) {
//     throw err;
//   }
// };
