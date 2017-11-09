const crypto = require('crypto')
const express = require('express')
const bodyParser = require('body-parser')
const EXAMPLE_FACILITIES = [
  {
    name: 'Hospital El Salvador',
    facilityId: 1,
    roles: [
      {type: 'medic', id: 1, name: 'Médico General'},
      {type: 'surgeon', id: 3, name: 'Médico Cirujano'},
    ]
  },
  {
    name: 'Hospital Félix Bulnes',
    facilityId: 2,
    roles: [
      {type: 'medic', id: 1, name: 'Médico General'},
      {type: 'principal', id: 9, name: 'Director'},
    ]
  }
]

const app = express()

app.use(bodyParser.json())

/*
  Expiramos la cookie del usuario que viene en el parámetro
  `username`. En un ambiente productivo expiraríamos está sesión
  en la base de datos, o el store que utilicemos para las sesiones.
  Llamada de ejemplo:
  curl -X "POST" "http://localhost:3000/api/logout" \
       -H "Content-Type: application/json; charset=utf-8" \
       -d $'{
    "username": "cristian.yanez"
  }'

*/
app.post('/logout', function (req, res) {
  console.log(req.cookies)
  const cookieName = 'sessionid_' + req.body.username
  res.cookie(cookieName, '', {expires: new Date()})
  res.send('logged out')
})

/* Llamada de ejemplo:
  curl -X "POST" "http://localhost:3000/api/login" \
       -H "Content-Type: application/json; charset=utf-8" \
       -d $'{
    "email": "cristian.yanez@2brains.cl",
    "password": "supersecreto!"
  }'
*/
app.post('/login', function (req, res) {
  const email = req.body.email
  const password = req.body.password
  const username = email.split('@')[0]

  const cookieName = 'sessionid_' + username
  const cookieValue = crypto.randomBytes(64).toString('hex')
  const tomorrow = new Date(Date.now() + 1000*60*60*24)

  res.cookie(cookieName, cookieValue, {
    // httpOnly: true,  // Flags the cookie to be accessible only by the web server.
    // secure: true,    // Marks the cookie to be used with HTTPS only.
    expires: tomorrow   // Expiry date of the cookie in GMT.
                        // If not specified or set to 0, creates a session cookie.
  })

  res.json({
    email: email,
    name: 'Juan Pérez',
    username: username,
    avatarUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/sillyleo/128.jpg',
    facilities: EXAMPLE_FACILITIES,
  })
})

exports.app = app
