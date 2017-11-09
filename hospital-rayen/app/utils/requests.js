"use strict";

// THIS MUST BE CLEANED ON PRODUCTION
// root de la api
const API_ROOT = 'http://172.16.0.169:16000/api';
// const API_ROOT = 'http://apiboilerplate.azurewebsites.net/api';

// token
let token = 'HSP l8H99ZUa9kKXV5ckQblWvnC6Uem/+ECElcAgm/fbM8PEvQooF+3mgdsVBaG2U+Xx0uWG9ZrUkgmWSF5mAjzjMKrYvwehvy6NFiq2xSiOvvY='
let tokenAdd = () =>  token ? token : '';

// ojo que al agregarle headers cambia el metodo a option. ver https://github.com/matthew-andrews/isomorphic-fetch/issues/51#issuecomment-291459282
export default  {
  get(url, getParams) {
    let apiPath = getParams ? urlWithParams(`${API_ROOT}${url}`, getParams) : url;
    return fetch(apiPath, {
      method: 'GET',
      mode: 'cors',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": tokenAdd()
      }
    });
  },
  post(url, body, getParams) {
    let apiPath = getParams ? urlWithParams(`${API_ROOT}${url}`, getParams) : url;
    return fetch(apiPath,
      { method: 'post',
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Authorization": tokenAdd()
      }
    })
  }
}

function urlWithParams(urlString, params={}) {
  var url = new URL(urlString);
  var searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key]);
  });
  url.search = searchParams.toString();
  // cannot send get parameter to s3, so just return url without parameters. CHECK THIS LATER!
  // return urlString.toString();
  return url.toString();
}
