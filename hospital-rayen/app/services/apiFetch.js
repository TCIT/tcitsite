// TCT: Need to fix, since obtaining current token, should be as fast as possible
import sessionsDB from '../databases/sessions';
import getSessionToken from './getSessionToken';

function getOptions() {
  return getSessionToken().then(sessionToken => {
    return getHeaders(sessionToken);
  });
}

function getHeaders(sessionToken) {
  return {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: sessionToken
    },
    credentials: 'same-origin',
  };
}

// TCT: Evaluate refactoring getOptions nesting
export default function get(path, queryParamObj) {
  return getOptions().then(options => {
    return fetch(getApiPath(path, queryParamObj), options)
      .then(processResponse)
      .catch(processErrors)
  });
}

export function post(path, body) {
  return getOptions().then(options => {
    return fetch(getApiPath(path), Object.assign({}, options, {
      method: 'POST',
      body: JSON.stringify(body),
    }))
      .then(processResponse)
      .catch(processErrors)
  });
}

// TCT: Evaluate refactoring post and put
export function putRequest(path, body) {
  return getOptions().then(options => {
    return fetch(getApiPath(path), Object.assign({}, options, {
      method: 'PUT',
      body: JSON.stringify(body)
    }))
      .then(processResponse)
      .catch(processErrors)
  });
}
export function del(path) {
  return getOptions().then(options => {
    return fetch(getApiPath(path), Object.assign({}, options, {
      method: 'DELETE'
    }))
      .then(processResponse)
      .catch(processErrors)
  });
}


function getApiPath(path, queryParamObj) {
  let completePath = `http://172.16.0.169:16000/api${path}`;
  if (queryParamObj) {
    completePath = `${completePath}?${objectToQueryParams(queryParamObj)}`;
  }
  return completePath;
  //return `http://rayensaludinpatient.azurewebsites.net/api${path}`;
}

function processResponse(response) {
  const thisResponse = response;
  if (response.ok) {
    return response.json();
  } else {
    if (response.contentType && response.contentType.indexOf("application/json") !== -1) {
      return response.json().then(error => { error }).then(Promise.reject.bind(Promise));  
    } else {
      return response.text().then((message) => ({ error: { message, status: thisResponse.status } })).then(Promise.reject.bind(Promise));
    }
  }
}

function objectToQueryParams(obj) {
  return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
} 

function processErrors(response) {
  let error = response;
  if (!error.error) {
    error = { error: response };
  }
  return error;
}