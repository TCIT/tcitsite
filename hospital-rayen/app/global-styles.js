import { injectGlobal } from 'styled-components';

/* IMPORTANTE: SE DEPRECARA STYLED COMPONENTS EN FAVOR DE SASS */

/* eslint no-unused-expressions: 0 */
injectGlobal`

  html,
  body {
    height: 100%;
    width: 100%;
  }
  .opacity-enter {
    opacity: 0;

    &.opacity-enter-active {
      opacity: 1;
      transition-duration: 1000ms;
      transition-property: opacity;
      transition-timing-function: $md-transition-deceleration;
    }
  }
`;
