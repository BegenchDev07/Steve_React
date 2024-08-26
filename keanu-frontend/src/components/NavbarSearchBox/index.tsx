import "/src/assets/css/index.css";

function NavbarSearchBox() {
  return (
    <div className="navbar-search-box">
      <div className="navbar-search-box-input flex items-center h-10 w-80 bg-white px-4 py-4 hover:bg-gray-100 hover:rounded-md gap-2">
        <div className="navbar-search-box-icon">          
          {/* <svg className="icon text-black" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5893" width="32" height="32"><path d="M469.333 192c153.174 0 277.334 124.16 277.334 277.333 0 68.054-24.534 130.411-65.216 178.688L846.336 818.24l-48.341 49.877L630.4 695.125a276.053 276.053 0 0 1-161.067 51.542C316.16 746.667 192 622.507 192 469.333S316.16 192 469.333 192z m0 64C351.51 256 256 351.51 256 469.333s95.51 213.334 213.333 213.334 213.334-95.51 213.334-213.334S587.157 256 469.333 256z" p-id="5894" fill="#bfbfbf"></path></svg>          
           */}
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>

        </div>
        <input
          className="navbar-search-box-input h-8 w-full text-sm bg-white text-black hover:bg-gray-100 focus:outline-none focus:text-black"
          type="text"
          placeholder="Search projects, settings, or people"
        />
      </div>
    </div>
  );
}

export default NavbarSearchBox;
