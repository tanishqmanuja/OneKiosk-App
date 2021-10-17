export const titleShortener = (str: string, max = 30) => {
  const romanize = (num: any) => {
    if (isNaN(num)) return NaN;
    const digits = String(+num).split('');
    const key = [
      '',
      'C',
      'CC',
      'CCC',
      'CD',
      'D',
      'DC',
      'DCC',
      'DCCC',
      'CM',
      '',
      'X',
      'XX',
      'XXX',
      'XL',
      'L',
      'LX',
      'LXX',
      'LXXX',
      'XC',
      '',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
    ];
    let roman = '';
    let i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
  };

  const titleCase = (s: string) =>
    s.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

  if (str.length > max) {
    const arr = str.split(/(\s+)/).filter((e) => e.trim().length > 0);
    let short = '';
    arr.forEach((x, i) => {
      if (x !== arr[arr.length - 1]) {
        if (x.toLowerCase() === 'and') {
          short += '& ';
        } else if (x === '-') {
          short += '- ';
        } else {
          short += x[0].toUpperCase() + '. ';
        }
      } else if (x.charAt(0) === '-') {
        arr[arr.length - 1] = '- ' + romanize(x.slice(1));
      } else if (short.length + arr[arr.length - 1].length > max) {
        if (romanize(x)) {
          arr[arr.length - 1] = romanize(x).toString();
        } else {
          arr[arr.length - 1] = x[0].toUpperCase() + '. ';
        }
      } else {
        arr[arr.length - 1] = titleCase(arr[arr.length - 1]);
      }
    });
    return titleCase(short) + arr[arr.length - 1];
  } else {
    return titleCase(str);
  }
};

export const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
