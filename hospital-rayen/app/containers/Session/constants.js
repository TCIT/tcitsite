export const ADD_SESSION = 'app/Session/ADD_SESSION';
export const CLEAR_CURRENT_SESSION = 'app/Session/CLEAR_CURRENT_SESSION';
export const CONFIRM_ROLE = 'app/Session/CONFIRM_ROLE';
export const CONFIRM_ROLE_SUCCESS = 'app/Session/CONFIRM_ROLE_SUCCESS';
export const CONFIRM_ROLE_FAIL = 'app/Session/CONFIRM_ROLE_FAIL';
export const FORGET_SESSION = 'app/Session/FORGET_SESSION';
export const FORGET_SESSION_SUCCESS = 'app/Session/FORGET_SESSION_SUCCESS';
export const FORGET_SESSION_FAIL = 'app/Session/FORGET_SESSION_FAIL';
export const LOGIN_FAIL = 'app/Session/LOGIN_FAIL';
export const LOGIN_SUCCESS = 'app/Session/LOGIN_SUCCESS';
export const RESUME_SESSION = 'app/Session/RESUME_SESSION';
export const RESUME_SESSION_SUCCESS = 'app/Session/RESUME_SESSION_SUCCESS';
export const SIGN_UP = 'app/Session/SIGN_UP';
export const CONTROLS_CHANGED = 'app/Session/CONTROLS_CHANGED';
export const CHANGE_PASSWORD = 'app/Session/CHANGE_PASSWORD';
export const CHANGE_PASSWORD_SUCCESS = 'app/Session/CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAIL = 'app/Session/CHANGE_PASSWORD_FAIL';
export const FIRST_LOGIN = 'app/Session/FIRST_LOGIN';




export const EXAMPLE_FACILITIES = [
  {
    name: 'Hospital El Salvador',
    facilityId: 1,
    roles: [
      { type: 'medic', id: 1, name: 'Médico General' },
      { type: 'surgeon', id: 3, name: 'Médico Cirujano' },
    ]
  },
  {
    name: 'Hospital Félix Bulnes',
    facilityId: 2,
    roles: [
      { type: 'medic', id: 1, name: 'Médico General' },
      { type: 'principal', id: 9, name: 'Director' },
    ]
  },
];

export const INITIAL_SESSIONS = [
  // Usuario con la sesión iniciada:
  //  - Tiene token.
  //  - Tiene sus establecimientos en `facilities` con sus respectivos roles.
  //  - Eligió un rol de un establecimiento (facilityId + roleId).
  {
    token: 'GGLGGLGGLGGLGGLGGLGGLGGLGGL',
    remember: true,
    facilityId: 1,
    roleId: 1,
    email: 'cristian.yanez@2brains.cl',
    username: 'ggl',
    avatarUrl: '',
    facilitiesRol: [
      {
        facility: { name: 'Hospital El Salvador', id: 1 },
        practitionerRoleList: [
          { id: 1, name: 'Médico' }
        ],
      }
    ],
    user: '182974552',
    healthCarePractitioner: {
      firstGivenName: 'Cristian',
      firstFamilyName: 'Yáñez',
    }
  },
  {
    email: 'nicolas.justiniano@2brains.cl',
    username: 'nicolas',
    avatarUrl: 'https://cl.ly/0I1u0w0W2k05/nico.png',
    remember: false,
    facilityId: 1,
    roleId: 1,
    token: 'NICONICONICONICONICONICONICO',
    facilitiesRol: [
      {
        facility: {
          name: 'Hospital El Salvador',
          id: 1,
        },
        practitionerRoleList: [
          {
            id: 1,
            name: 'Médico General'
          }
        ],
      }
    ],
    user: '33333',
    healthCarePractitioner: {
      firstGivenName: 'Nicolas',
      firstFamilyName: 'Justiniano'
    }
  },


  // Usuario con la sesión cerrada:
  //  - remember es `false`
  //  - No tiene token.
  //  - No tiene sus establecimientos en `facilities`.
  //  - No tiene facilityId ni roleId.
  {
    email: 'juan.bastidas@2brains.cl',
    name: 'Juan Bastidas',
    username: 'jbastidas11',
    avatarUrl: 'https://cl.ly/0F2K3G3u0s3k/juan.png',
    token: '',
    remember: false,
    user: '2222',
    healthCarePractitioner: {
      firstGivenName: 'Juan',
      firstFamilyName: 'Bastidas',
    }
  },
  {
    email: 'sabino@2brains.cl',
    name: 'Sabino Velásquez',
    username: 'sabino',
    token: '',
    remember: false,
    avatarUrl: 'https://cl.ly/2R0H1F3W1Z3A/sabino.png',
    user: '11111',
    healthCarePractitioner: {
      firstGivenName: 'Sabino',
      firstFamilyName: 'Velásquez',
    }
  },
]
