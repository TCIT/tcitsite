import messages from './messages';

export function calculateInterval(date, formatMessage) {
  let interval = '';
  const hours = (new Date() - new Date(date))/(1000*60*60);
  const days = hours/24;
  const months = days/30;
  const years = days/365.25;
  const roundedHours = Math.round(hours % 24);
  const roundedDays = Math.round(days % 30);
  const roundedMonths = Math.round(months % 12);
  const roundedYears = Math.round(years);
  const strHours = `${roundedHours} ${formatMessage({...messages.hour}).toLowerCase()}${roundedHours === 1 ? '' : 's'}`;
  const strDays = `${roundedDays} ${formatMessage({...messages.day}).toLowerCase()}${roundedDays === 1 ? '' : 's'}`;
  const strMonths = `${roundedMonths} ${roundedMonths === 1 ? formatMessage({...messages.month}).toLowerCase() : formatMessage({...messages.months}).toLowerCase()}`;
  const strYears = `${roundedYears} ${formatMessage({...messages.year}).toLowerCase()}${roundedYears === 1 ? '' : 's'}`;

  if (days < 3) {
    interval = `${strDays} y ${strHours}`;
  } else {
    if (years < 1) {
      interval = `${strMonths} y ${strDays}`;
    } else {
      if (years< 5) {
        interval = `${strYears} y ${strMonths}`;
      } else {
        interval = strYears;
      }
    }
  }
  return interval;
}
export function calculateStay(date, formatMessage) {
  let stayHours = (new Date() - date)/(1000*60*60);
  const stayDays = Math.round(stayHours/24);
  stayHours = Math.round(stayHours);
  let stay = '';
  if (stayHours < 24) {
    const zero = stayHours < 10 ? '0' : '';
    stay = `${zero}${stayHours} ${formatMessage({...messages.hour})}${stayHours === 1 ? '' : 's'}`;

  } else {
    const zero = stayDays < 10 ? '0' : '';
    stay = `${zero}${stayDays} ${formatMessage({...messages.day})}${stayDays === 1 ? '' : 's'}`;
  }
  return stay;
}


export function hsla(h, s, l, a){
  var r, g, b;
  if(s == 0){
      r = g = b = l; // achromatic
  }else{
      var hue2rgb = function hue2rgb(p, q, t){
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      }
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }
  return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a}`;
}
