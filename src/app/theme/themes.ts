export interface Theme {
    name: string;
    properties: any;
}

const blue: Theme = {
    name: 'blue',
    properties: {
        '--background': '#E6EBF2',
        '--dark': '#103B66',
        '--primary': '#215C96',
        '--secondary': '#CCE5FF',
        '--accent': '#61E786',
    }
};
const cyan: Theme = {
    name: 'cyan',
    properties: {
        '--background': '#E6EBF2',
        '--dark': '#0c515c',
        '--primary': '#17a2b8',
        '--secondary': '#d9eff2',
        '--accent': '#ff7a66',
    }
};
const green: Theme = {
    name: 'green',
    properties: {
        '--background': '#E6EBF2',
        '--dark': '#0F6634',
        '--primary': '#219653',
        '--secondary': '#CCFFE2',
        '--accent': '#EEC6CA',
    }
};
const brown: Theme = {
    name: 'brown',
    properties: {
        '--background': '#E6EBF2',
        '--dark': '#340100',
        '--primary': '#7D4106',
        '--secondary': '#FFD6B2',
        '--accent': '#77BFA3',
    }
};
const red: Theme = {
    name: 'red',
    properties: {
        '--background': '#E6EBF2',
        '--dark': '#7D0C0C',
        '--primary': '#A50104',
        '--secondary': '#FFCCCC',
        '--accent': '#FFF05A',
    }
};
const violet: Theme = {
    name: 'violet',
    properties: {
        '--background': '#E6EBF2',
        '--dark': '#744E6D',
        '--primary': '#B26BA5',
        '--secondary': '#E8C2E1',
        '--accent': '#9CE8D0',
    }
};
const pink: Theme = {
    name: 'pink',
    properties: {
        '--background': '#E6EBF2',
        '--dark': '#741F46',
        '--primary': '#E83E8C',
        '--secondary': '#FEE6F1',
        '--accent': '#3EE89A',
    }
};
const purple: Theme = {
    name: 'purple',
    properties: {
        '--background': '#E6EBF2',
        '--dark': '#43067F',
        '--primary': '#850CFD',
        '--secondary': '#D9B4FE',
        '--accent': '#0CFD85'
    }
};
const orange: Theme = {
    name: 'orange',
    properties: {
        '--background': '#E6EBF2',
        '--dark': '#7D381B',
        '--primary': '#F97035',
        '--secondary': '#FFDBCC',
        '--accent': '#4EAE6B'
    }
};
const gray: Theme = {
    name: 'gray',
    properties: {
        '--background': '#E6EBF2',
        '--dark': '#343a40',
        '--primary': '#6C757B',
        '--secondary': '#eef3f6',
        '--accent': '#ff7575'
    }
};
export let colors = [
    blue,
    cyan,
    green,
    brown,
    red,
    violet,
    pink,
    purple,
    orange,
    gray
];
