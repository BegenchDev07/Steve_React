module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {    
    extend: {
      gridTemplateColumns: {
        'resource-card': 'repeat(auto-fit,minmax(320px,1fr))',
        'template-card': 'repeat(auto-fill,minmax(192px,1fr))',
      },
      gridTemplateRows: {

      },
      typography:{
        DEFAULT:{
          css:{
            a:{
              color: 'white',
              width: '10rem',
              backgroundColor: '#1669d0',
              textDecoration: 'none',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              borderRadius: '1rem'
            }
          }
        }
      },
      colors:{
        'shitty': '#cbdc47',
        'shitty-hover': '#afc126',
        'indie-red':'#E4003A',
        'colorful-yellow':'#FFB200',
        'night-blue':'#131842'
      },
      maxHeight: {
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
        '124': '31rem',
        '128': '32rem',
      }
    },
  },
  corePlugins: {
    // preflight: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide')
  ],
};